import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

/**
 * 保存痛点分析历史记录
 * POST /api/pain-points/history
 */
export async function POST(req: NextRequest) {
  try {
    // 验证用户登录
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      query,
      keywords,
      redditPosts = [],
      xPosts = [],
      totalPosts = 0,
      summary,
      frustrationScore,
      insights = [],
      searchTime,
      analysisTime,
    } = body;

    // 验证必填字段
    if (!query || !summary || frustrationScore === undefined || !Array.isArray(insights)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 保存到数据库
    const record = await prisma.painPointAnalysis.create({
      data: {
        userId: session.user.id,
        query,
        keywords: keywords || null,
        redditPosts: redditPosts,
        xPosts: xPosts,
        totalPosts,
        summary,
        frustrationScore,
        insights: insights,
        searchTime: searchTime || null,
        analysisTime: analysisTime || null,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    console.log('[PainPointHistory] Record saved:', record.id);

    return NextResponse.json({
      success: true,
      id: record.id,
      createdAt: record.createdAt,
    });

  } catch (error) {
    console.error('[PainPointHistory] Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis history' },
      { status: 500 }
    );
  }
}

/**
 * 获取用户的历史记录列表
 * GET /api/pain-points/history?page=1&limit=10
 */
export async function GET(req: NextRequest) {
  try {
    // 验证用户登录
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // 获取分页参数
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // 查询历史记录
    const [records, total] = await Promise.all([
      prisma.painPointAnalysis.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          query: true,
          keywords: true,
          summary: true,
          frustrationScore: true,
          totalPosts: true,
          insights: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.painPointAnalysis.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('[PainPointHistory] Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    );
  }
}
