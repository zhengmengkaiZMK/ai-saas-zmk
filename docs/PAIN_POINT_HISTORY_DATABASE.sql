-- ==========================================
-- Pain Point Analysis History Table
-- 痛点分析历史记录表
-- ==========================================
-- 功能：存储用户的痛点检索分析历史记录
-- 使用：可在 Supabase SQL Editor 中直接执行
-- ==========================================

-- 1. 创建痛点分析历史表
CREATE TABLE IF NOT EXISTS pain_point_analyses (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 用户关联
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 检索信息
  query TEXT NOT NULL,                    -- 用户输入的问题/查询
  keywords TEXT,                          -- 提取的关键词（可选）
  
  -- 搜索结果
  reddit_posts JSONB DEFAULT '[]'::jsonb, -- Reddit 帖子数据（JSON数组）
  x_posts JSONB DEFAULT '[]'::jsonb,      -- X(Twitter) 帖子数据（JSON数组）
  total_posts INT DEFAULT 0,              -- 搜索结果总数
  
  -- AI 分析结果
  summary TEXT NOT NULL,                  -- 执行摘要
  frustration_score INT NOT NULL,         -- 愤怒指数 (0-100)
  insights JSONB NOT NULL,                -- 6个痛点详情（JSON数组）
  
  -- 元数据
  search_time INT,                        -- 搜索耗时（毫秒）
  analysis_time INT,                      -- 分析耗时（毫秒）
  
  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 索引建议
  CONSTRAINT insights_is_array CHECK (jsonb_typeof(insights) = 'array')
);

-- 2. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_pain_point_analyses_user_id 
  ON pain_point_analyses(user_id);

CREATE INDEX IF NOT EXISTS idx_pain_point_analyses_created_at 
  ON pain_point_analyses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pain_point_analyses_user_created 
  ON pain_point_analyses(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pain_point_analyses_query 
  ON pain_point_analyses USING gin(to_tsvector('english', query));

-- 3. 创建自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_pain_point_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pain_point_analyses_updated_at
  BEFORE UPDATE ON pain_point_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_pain_point_analyses_updated_at();

-- 4. 添加注释
COMMENT ON TABLE pain_point_analyses IS '用户痛点分析历史记录表';
COMMENT ON COLUMN pain_point_analyses.id IS '主键UUID';
COMMENT ON COLUMN pain_point_analyses.user_id IS '用户ID（外键关联users表）';
COMMENT ON COLUMN pain_point_analyses.query IS '用户输入的检索问题';
COMMENT ON COLUMN pain_point_analyses.keywords IS '提取的关键词';
COMMENT ON COLUMN pain_point_analyses.reddit_posts IS 'Reddit帖子数据（JSONB数组）';
COMMENT ON COLUMN pain_point_analyses.x_posts IS 'X平台帖子数据（JSONB数组）';
COMMENT ON COLUMN pain_point_analyses.total_posts IS '搜索结果总数';
COMMENT ON COLUMN pain_point_analyses.summary IS 'AI生成的执行摘要';
COMMENT ON COLUMN pain_point_analyses.frustration_score IS '愤怒指数（0-100）';
COMMENT ON COLUMN pain_point_analyses.insights IS '6个痛点详情（JSONB数组）';
COMMENT ON COLUMN pain_point_analyses.search_time IS '搜索耗时（毫秒）';
COMMENT ON COLUMN pain_point_analyses.analysis_time IS '分析耗时（毫秒）';
COMMENT ON COLUMN pain_point_analyses.created_at IS '创建时间';
COMMENT ON COLUMN pain_point_analyses.updated_at IS '更新时间';

-- ==========================================
-- 示例查询语句（用于测试）
-- ==========================================

-- 查询某个用户的所有历史记录（按时间倒序）
-- SELECT * FROM pain_point_analyses 
-- WHERE user_id = '你的用户UUID' 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- 查询所有用户最近的记录
-- SELECT 
--   pa.*,
--   u.email,
--   u.name
-- FROM pain_point_analyses pa
-- JOIN users u ON pa.user_id = u.id
-- ORDER BY pa.created_at DESC
-- LIMIT 20;

-- 统计每个用户的搜索次数
-- SELECT 
--   user_id,
--   u.email,
--   COUNT(*) as total_searches
-- FROM pain_point_analyses pa
-- JOIN users u ON pa.user_id = u.id
-- GROUP BY user_id, u.email
-- ORDER BY total_searches DESC;
