// src/apis/materialVersion.ts
// 完全自包含，使用 db_insert, db_update, db_delete, db_query

const API_URL = "http://127.0.0.1:44944/database";
const PROJECT_DB = "./material";

// ---------- 基础数据库操作 ----------
const dbFetch = async (symbol: string, body: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/libary',
      'FFI-Symbol': symbol,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const dbQuery = async (sql: string, path: string = PROJECT_DB) => {
  const raw = await dbFetch('db_query', { path, sql });
  if (raw?.data && Array.isArray(raw.data)) {
    return raw.data;
  }
  return raw;
};

const dbInsert = (sql: string, path: string = PROJECT_DB) => {
  return dbFetch('db_insert', { path, sql });
};

const dbUpdate = (sql: string, path: string = PROJECT_DB) => {
  return dbFetch('db_update', { path, sql });
};

const dbDelete = (sql: string, path: string = PROJECT_DB) => {
  return dbFetch('db_delete', { path, sql });
};

// ---------- 素材版本 CRUD ----------
// 表名：material_version，列：id, uuid, cover, page_uid, child_uid, soft_ver, name, logs, fuid, create_by, created_at, updated_at, deleted_at

// 1. 新增素材版本
export const insertMaterialVersion = async (data: any) => {
  const sql = `
    INSERT INTO material_version (
      "uuid", "cover", "page_uid", "child_uid", "soft_ver", "name", "logs", "fuid", "create_by"
    ) VALUES (
      '${data.uuid || ''}', '${data.cover || ''}', '${data.page_uid || ''}',
      '${data.child_uid || ''}', '${data.soft_ver || ''}', '${data.name || ''}',
      '${data.logs || ''}', '${data.fuid || ''}', '${data.create_by || ''}'
    )
  `;
  return await dbInsert(sql);
};

// 2. 更新素材版本（按 id）
export const updateMaterialVersion = async (id: number, data: any) => {
  const setFields: string[] = [];
  const allowed = ['uuid', 'cover', 'page_uid', 'child_uid', 'soft_ver', 'name', 'logs', 'fuid', 'create_by'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      const val = typeof data[key] === 'string' ? `'${data[key]}'` : data[key];
      setFields.push(`"${key}" = ${val}`);
    }
  }
  if (setFields.length === 0) throw new Error('No fields to update');
  setFields.push(`updated_at = datetime('now')`);
  const sql = `UPDATE material_version SET ${setFields.join(', ')} WHERE id = ${id}`;
  return await dbUpdate(sql);
};

// 3. 软删除
export const softDeleteMaterialVersion = async (id: number) => {
  const sql = `UPDATE material_version SET deleted_at = datetime('now') WHERE id = ${id}`;
  return await dbUpdate(sql);
};

// 4. 物理删除
export const deleteMaterialVersion = async (id: number) => {
  const sql = `DELETE FROM material_version WHERE id = ${id}`;
  return await dbDelete(sql);
};

// 5. 按 id 查询单个
export const getMaterialVersionById = async (id: number) => {
  const rows = await dbQuery(`SELECT * FROM material_version WHERE id = ${id} AND deleted_at IS NULL`);
  return rows?.[0] || null;
};

// 6. 通用查询列表
export const getMaterialVersionList = async (where: string = '', order: string = 'id DESC', limit?: number) => {
  let sql = `SELECT * FROM material_version WHERE deleted_at IS NULL`;
  if (where) sql += ` AND ${where}`;
  sql += ` ORDER BY ${order}`;
  if (limit) sql += ` LIMIT ${limit}`;
  return await dbQuery(sql);
};

// 7. 按素材文件（page_uid）查询
export const getMaterialVersionsByPageUid = async (pageUid: string) => {
  return await getMaterialVersionList(`page_uid = '${pageUid}'`);
};

// 8. 按文件编号（fuid）查询
export const getMaterialVersionsByFuid = async (fuid: string) => {
  return await getMaterialVersionList(`fuid = '${fuid}'`);
};