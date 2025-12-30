import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

/**
 * 测试数据库连接和 pain_point_analyses 表
 * GET /api/pain-points/test-db
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: [],
  };

  try {
    // 1. 检查用户认证
    const session = await getServerSession(authOptions);
    results.checks.push({
      name: '用户认证',
      status: session?.user ? 'success' : 'warning',
      message: session?.user ? `已登录: ${session.user.email}` : '未登录',
      data: { userId: session?.user?.id, email: session?.user?.email },
    });

    // 2. 检查数据库连接
    try {
      await prisma.$connect();
      results.checks.push({
        name: '数据库连接',
        status: 'success',
        message: '数据库连接成功',
      });
    } catch (error: any) {
      results.checks.push({
        name: '数据库连接',
        status: 'error',
        message: '数据库连接失败',
        error: error.message,
      });
      return NextResponse.json(results, { status: 500 });
    }

    // 3. 检查 pain_point_analyses 表是否存在
    try {
      const count = await prisma.painPointAnalysis.count();
      results.checks.push({
        name: 'pain_point_analyses 表',
        status: 'success',
        message: `表存在，当前记录数: ${count}`,
        data: { count },
      });
    } catch (error: any) {
      results.checks.push({
        name: 'pain_point_analyses 表',
        status: 'error',
        message: '表不存在或无法访问',
        error: error.message,
        suggestion: '请在 Supabase SQL Editor 中执行 docs/PAIN_POINT_HISTORY_DATABASE.sql',
      });
      return NextResponse.json(results, { status: 500 });
    }

    // 4. 检查表结构
    try {
      const columns: any = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'pain_point_analyses'
        ORDER BY ordinal_position;
      `;
      results.checks.push({
        name: '表结构',
        status: 'success',
        message: `表结构正常，共 ${columns.length} 个字段`,
        data: { columns },
      });
    } catch (error: any) {
      results.checks.push({
        name: '表结构',
        status: 'warning',
        message: '无法查询表结构',
        error: error.message,
      });
    }

    // 5. 如果用户已登录，尝试查询该用户的记录
    if (session?.user?.id) {
      try {
        const userRecords = await prisma.painPointAnalysis.findMany({
          where: { userId: session.user.id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            query: true,
            frustrationScore: true,
            createdAt: true,
          },
        });

        results.checks.push({
          name: '用户历史记录',
          status: 'success',
          message: `找到 ${userRecords.length} 条记录`,
          data: { records: userRecords },
        });
      } catch (error: any) {
        results.checks.push({
          name: '用户历史记录',
          status: 'error',
          message: '查询用户记录失败',
          error: error.message,
        });
      }
    }

    // 6. 检查 users 表（用于外键关联）
    try {
      const userCount = await prisma.user.count();
      results.checks.push({
        name: 'users 表',
        status: 'success',
        message: `users 表正常，共 ${userCount} 个用户`,
        data: { userCount },
      });
    } catch (error: any) {
      results.checks.push({
        name: 'users 表',
        status: 'error',
        message: 'users 表异常',
        error: error.message,
      });
    }

    results.summary = '✅ 所有检查通过';
    return NextResponse.json(results);

  } catch (error: any) {
    results.checks.push({
      name: '未知错误',
      status: 'error',
      message: '诊断过程中出现未知错误',
      error: error.message,
      stack: error.stack,
    });
    results.summary = '❌ 诊断失败';
    return NextResponse.json(results, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
