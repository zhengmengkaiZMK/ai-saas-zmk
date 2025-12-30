/**
 * 痛点分析历史记录功能诊断脚本
 * 用于检查数据库表、Prisma配置是否正常
 */

import { prisma } from '../lib/db/prisma';

async function diagnose() {
  console.log('🔍 开始诊断痛点分析历史记录功能...\n');

  try {
    // 1. 检查数据库连接
    console.log('1️⃣ 检查数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功\n');

    // 2. 检查 pain_point_analyses 表是否存在
    console.log('2️⃣ 检查 pain_point_analyses 表...');
    try {
      const count = await prisma.painPointAnalysis.count();
      console.log(`✅ pain_point_analyses 表存在，当前记录数: ${count}\n`);
    } catch (error: any) {
      console.error('❌ pain_point_analyses 表不存在或无法访问');
      console.error('错误信息:', error.message);
      console.error('\n请执行 docs/PAIN_POINT_HISTORY_DATABASE.sql 中的 SQL 语句\n');
      throw error;
    }

    // 3. 检查表结构
    console.log('3️⃣ 检查表结构（执行测试查询）...');
    try {
      const testQuery = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'pain_point_analyses'
        ORDER BY ordinal_position;
      `;
      console.log('✅ 表结构正常');
      console.log('字段列表:', testQuery);
      console.log();
    } catch (error: any) {
      console.error('❌ 无法查询表结构:', error.message, '\n');
    }

    // 4. 检查索引
    console.log('4️⃣ 检查索引...');
    try {
      const indexes = await prisma.$queryRaw`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'pain_point_analyses';
      `;
      console.log('✅ 索引列表:', indexes);
      console.log();
    } catch (error: any) {
      console.warn('⚠️ 无法查询索引:', error.message, '\n');
    }

    // 5. 尝试创建测试记录
    console.log('5️⃣ 测试创建记录（模拟数据）...');
    
    // 先获取一个测试用户
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true }
    });

    if (!testUser) {
      console.warn('⚠️ 没有找到测试用户，跳过创建测试记录\n');
    } else {
      console.log(`使用测试用户: ${testUser.email} (${testUser.id})`);
      
      try {
        const testRecord = await prisma.painPointAnalysis.create({
          data: {
            userId: testUser.id,
            query: '[诊断测试] 测试查询',
            keywords: 'test, diagnosis',
            redditPosts: [
              { title: 'Test Post', content: 'Test content', url: 'https://example.com' }
            ],
            xPosts: [],
            totalPosts: 1,
            summary: '这是一个测试记录，用于诊断功能是否正常',
            frustrationScore: 50,
            insights: [
              { title: '测试痛点1', description: '测试描述', severity: 'medium' }
            ],
            searchTime: 1000,
            analysisTime: 2000,
          }
        });

        console.log('✅ 测试记录创建成功！');
        console.log('记录 ID:', testRecord.id);
        console.log('创建时间:', testRecord.createdAt);
        console.log();

        // 6. 尝试查询记录
        console.log('6️⃣ 测试查询记录...');
        const records = await prisma.painPointAnalysis.findMany({
          where: { userId: testUser.id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            query: true,
            createdAt: true,
            user: {
              select: { email: true }
            }
          }
        });

        console.log(`✅ 查询成功，找到 ${records.length} 条记录:`);
        records.forEach((record, index) => {
          console.log(`  ${index + 1}. ${record.query} - ${record.createdAt}`);
        });
        console.log();

        // 7. 清理测试记录
        console.log('7️⃣ 清理测试记录...');
        await prisma.painPointAnalysis.delete({
          where: { id: testRecord.id }
        });
        console.log('✅ 测试记录已删除\n');

      } catch (error: any) {
        console.error('❌ 创建/查询测试记录失败:', error.message);
        console.error('完整错误:', error);
        console.error();
      }
    }

    console.log('✅ 诊断完成！功能正常\n');

  } catch (error: any) {
    console.error('\n❌ 诊断过程中出现错误:');
    console.error(error);
    console.error('\n请检查:');
    console.error('1. DATABASE_URL 环境变量是否正确配置');
    console.error('2. 是否在 Supabase 中执行了建表 SQL');
    console.error('3. 是否运行了 npx prisma generate');
    console.error('4. 数据库连接是否正常\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
