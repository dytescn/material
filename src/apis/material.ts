// src/apis/materialFile.ts
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

// ---------- 素材文件 CRUD ----------
// 表名：material_file，列：id, uuid, puid, ouid, flow_uid, type_uid, name, "desc", cover, create_by, created_at, updated_at, deleted_at

// 1. 新增素材文件
export const insertMaterialFile = async (data: any) => {
  const sql = `
    INSERT INTO material_file (
      "uuid", "puid", "ouid", "flow_uid", "type_uid", "name", "desc", "cover", "create_by"
    ) VALUES (
      '${data.uuid || ''}', '${data.puid || ''}', '${data.ouid || ''}',
      '${data.flow_uid || ''}', '${data.type_uid || ''}', '${data.name || ''}',
      '${data.desc || ''}', '${data.cover || ''}', '${data.create_by || ''}'
    )
  `;
  return await dbInsert(sql);
};

// 2. 更新素材文件（按 id）
export const updateMaterialFile = async (id: number, data: any) => {
  const setFields: string[] = [];
  const allowed = ['uuid', 'puid', 'ouid', 'flow_uid', 'type_uid', 'name', 'desc', 'cover', 'create_by'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      const val = typeof data[key] === 'string' ? `'${data[key]}'` : data[key];
      setFields.push(`"${key}" = ${val}`);
    }
  }
  if (setFields.length === 0) throw new Error('No fields to update');
  setFields.push(`updated_at = datetime('now')`);
  const sql = `UPDATE material_file SET ${setFields.join(', ')} WHERE id = ${id}`;
  return await dbUpdate(sql);
};

// 3. 软删除（设置 deleted_at）
export const softDeleteMaterialFile = async (id: number) => {
  const sql = `UPDATE material_file SET deleted_at = datetime('now') WHERE id = ${id}`;
  return await dbUpdate(sql);
};

// 4. 物理删除
export const deleteMaterialFile = async (id: number) => {
  const sql = `DELETE FROM material_file WHERE id = ${id}`;
  return await dbDelete(sql);
};

// 5. 按 id 查询单个（未软删除）
export const getMaterialFileById = async (id: number) => {
  const rows = await dbQuery(`SELECT * FROM material_file WHERE id = ${id} AND deleted_at IS NULL`);
  return rows?.[0] || null;
};

// 6. 通用查询列表（支持 WHERE、ORDER BY、LIMIT）
export const getMaterialFileList = async (where: string = '', order: string = 'id DESC', limit?: number) => {
  let sql = `SELECT * FROM material_file WHERE deleted_at IS NULL`;
  if (where) sql += ` AND ${where}`;
  sql += ` ORDER BY ${order}`;
  if (limit) sql += ` LIMIT ${limit}`;
  return await dbQuery(sql);
};

// 7. 按项目（puid）查询
export const getMaterialFilesByPuid = async (puid: string) => {
  return await getMaterialFileList(`puid = '${puid}'`);
};

// 8. 按组织（ouid）查询
export const getMaterialFilesByOuid = async (ouid: string) => {
  return await getMaterialFileList(`ouid = '${ouid}'`);
};