import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

/**
 * 获取单条历史记录详情
 * GET /api/pain-points/history/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户登录
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // 查询记录
    const record = await prisma.painPointAnalysis.findFirst({
      where: {
        id,
        userId: session.user.id, // 确保只能访问自己的记录
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Record not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ record });

  } catch (error) {
    console.error('[PainPointHistory] Fetch detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis detail' },
      { status: 500 }
    );
  }
}

/**
 * 删除历史记录
 * DELETE /api/pain-points/history/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户登录
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // 删除记录（确保只能删除自己的记录）
    const deleted = await prisma.painPointAnalysis.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Record not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[PainPointHistory] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete analysis record' },
      { status: 500 }
    );
  }
}
