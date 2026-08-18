// src/apis/material.ts
const API_URL = "http://127.0.0.1:44944/database";
const DB_PATH = "./material";

const dbFetch = async (symbol: string, body: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const dbQuery = async (sql: string, path: string = DB_PATH) => {
  const raw = await dbFetch("db_query", { path, sql });
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.data)) return raw.data;
    if (raw.data && typeof raw.data === "object") {
      if (Array.isArray(raw.data.rows)) return raw.data.rows;
      if (Array.isArray(raw.data.result)) return raw.data.result;
      if (Array.isArray(raw.data.list)) return raw.data.list;
    }
    if (Array.isArray(raw.result)) return raw.result;
    if (Array.isArray(raw.rows)) return raw.rows;
  }
  return [];
};

const dbInsert = (sql: string, path: string = DB_PATH) => dbFetch("db_insert", { path, sql });
const dbUpdate = (sql: string, path: string = DB_PATH) => dbFetch("db_update", { path, sql });
const dbDelete = (sql: string, path: string = DB_PATH) => dbFetch("db_delete", { path, sql });

export const insertMaterialFile = async (data: any) => {
  const sql = `
    INSERT INTO material_file (
      uuid, project_uid, organ_uid, flow_uid, type_uid, name, description, cover, create_by
    ) VALUES (
      '${data.uuid || ""}', '${data.project_uid || ""}', '${data.organ_uid || ""}',
      '${data.flow_uid || ""}', '${data.type_uid || ""}', '${data.name || ""}',
      '${data.description || ""}', '${data.cover || ""}', '${data.create_by || ""}'
    )
  `;
  return await dbInsert(sql);
};

export const updateMaterialFile = async (id: number, data: any) => {
  const setFields: string[] = [];
  const allowed = ["uuid", "project_uid", "organ_uid", "flow_uid", "type_uid", "name", "description", "cover", "create_by"];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      const val = typeof data[key] === "string" ? `'${data[key]}'` : data[key];
      setFields.push(`${key} = ${val}`);
    }
  }
  if (setFields.length === 0) throw new Error("No fields to update");
  setFields.push(`updated_at = datetime('now','localtime')`);
  const sql = `UPDATE material_file SET ${setFields.join(", ")} WHERE id = ${id}`;
  return await dbUpdate(sql);
};

export const updateMaterialFileByUuid = async (uuid: string, data: any) => {
  const setFields: string[] = [];
  const allowed = ["project_uid", "organ_uid", "flow_uid", "type_uid", "name", "description", "cover", "create_by"];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      const val = typeof data[key] === "string" ? `'${data[key]}'` : data[key];
      setFields.push(`${key} = ${val}`);
    }
  }
  if (setFields.length === 0) throw new Error("No fields to update");
  setFields.push(`updated_at = datetime('now','localtime')`);
  const sql = `UPDATE material_file SET ${setFields.join(", ")} WHERE uuid = '${uuid}'`;
  return await dbUpdate(sql);
};

export const softDeleteMaterialFile = async (id: number) => {
  const sql = `UPDATE material_file SET deleted_at = datetime('now','localtime') WHERE id = ${id}`;
  return await dbUpdate(sql);
};

export const softDeleteMaterialFileByUuid = async (uuid: string) => {
  const sql = `UPDATE material_file SET deleted_at = datetime('now','localtime') WHERE uuid = '${uuid}'`;
  return await dbUpdate(sql);
};

export const deleteMaterialFile = async (id: number) => {
  const sql = `DELETE FROM material_file WHERE id = ${id}`;
  return await dbDelete(sql);
};

export const getMaterialFileById = async (id: number) => {
  const rows = await dbQuery(`SELECT * FROM material_file WHERE id = ${id} AND deleted_at IS NULL`);
  return rows?.[0] || null;
};

export const getMaterialFileByUuid = async (uuid: string) => {
  const rows = await dbQuery(`SELECT * FROM material_file WHERE uuid = '${uuid}' AND deleted_at IS NULL`);
  return rows?.[0] || null;
};

export const getMaterialFileList = async (where = "", order = "id DESC", limit = 40) => {
  let sql = `SELECT * FROM material_file WHERE deleted_at IS NULL`;
  if (where) sql += ` AND ${where}`;
  sql += ` ORDER BY ${order}`;
  sql += ` LIMIT ${limit}`;
  return await dbQuery(sql);
};

export const getMaterialFilePage = async (page: number, pageSize: number, where = "", order = "id DESC") => {
  const offset = (page - 1) * pageSize;
  let sql = `SELECT * FROM material_file WHERE deleted_at IS NULL`;
  if (where) sql += ` AND ${where}`;
  sql += ` ORDER BY ${order} LIMIT ${pageSize} OFFSET ${offset}`;
  return await dbQuery(sql);
};

export const getMaterialFileCount = async (where = "") => {
  let sql = `SELECT COUNT(*) as total FROM material_file WHERE deleted_at IS NULL`;
  if (where) sql += ` AND ${where}`;
  const rows = await dbQuery(sql);
  return rows?.[0]?.total || 0;
};

export const getMaterialFilesByProjectUid = async (projectUid: string) => {
  return await getMaterialFileList(`project_uid = '${projectUid}'`);
};

export const getMaterialFilesByOrganUid = async (organUid: string) => {
  return await getMaterialFileList(`organ_uid = '${organUid}'`);
};

export const getMaterialFilesByTypeUid = async (typeUid: string) => {
  return await getMaterialFileList(`type_uid = '${typeUid}'`);
};