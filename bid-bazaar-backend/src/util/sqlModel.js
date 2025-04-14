const db = require("../database/database.js");

class SQLModel {
  constructor(table) {
    this.table = table;
  }

  async findById(id, columns = []) {
    try {
      const sql = `SELECT ${
        columns.length > 0 ? columns.join(", ") : "*"
      } FROM ${this.table} WHERE id = ?`;
      const [result] = await db.query(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (e) {
      console.error(`Error in findById: ${e.message}`);
      return null;
    }
  }

  async findBy(column, value, columns = []) {
    try {
      const sql = `SELECT ${
        columns.length > 0 ? columns.join(", ") : "*"
      } FROM ${this.table} WHERE ${column} = ?`;
      const [result] = await db.query(sql, [value]);
      return result;
    } catch (e) {
      console.error(`Error in findBy: ${e.message}`);
      return null;
    }
  }

  async findAll(columns = []) {
    try {
      const sql = `SELECT ${
        columns.length > 0 ? columns.join(", ") : "*"
      } FROM ${this.table}`;
      const [result] = await db.query(sql);
      return result;
    } catch (e) {
      console.error(`Error in findAll: ${e.message}`);
      return null;
    }
  }

  async insert(data) {
    try {
      const keys = Object.keys(data)
        .map((key) => `\`${key}\``)
        .join(", ");
      const values = Object.values(data);
      const placeholders = values.map(() => "?").join(", ");

      const sql = `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders})`;
      const [result] = await db.query(sql, values);
      return result.insertId;
    } catch (e) {
      console.error(`Error in insert: ${e.message}`);
      return null;
    }
  }

  async insertBulk(dataArray) {
    try {
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error("insertBulk expects a non-empty array");
      }

      const keys = Object.keys(dataArray[0])
        .map((key) => `\`${key}\``)
        .join(", ");
      const values = dataArray.map(Object.values);
      const placeholders = values
        .map((row) => `(${row.map(() => "?").join(", ")})`)
        .join(", ");

      const sql = `INSERT INTO ${this.table} (${keys}) VALUES ${placeholders}`;
      const flattenedValues = values.flat();

      const [result] = await db.query(sql, flattenedValues);
      return result.affectedRows;
    } catch (e) {
      console.error(`Error in insertBulk: ${e.message}`);
      return null;
    }
  }

  async insertAllowDuplicates(data, duplicateColumn, duplicateValue) {
    try {
      const keys = Object.keys(data)
        .map((key) => `\`${key}\``)
        .join(", ");
      const values = Object.values(data);
      const placeholders = values.map(() => "?").join(", ");

      const sql = `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders}) 
                         ON DUPLICATE KEY UPDATE \`${duplicateColumn}\` = ?`;
      values.push(duplicateValue);

      const [result] = await db.query(sql, values);
      return result.insertId;
    } catch (e) {
      console.error(`Error in insertAllowDuplicates: ${e.message}`);
      return null;
    }
  }

  async update(id, data) {
    try {
      const updates = Object.keys(data)
        .map((key) => `\`${key}\` = ?`)
        .join(", ");
      const values = [...Object.values(data), id];

      const sql = `UPDATE ${this.table} SET ${updates} WHERE id = ?`;
      const [result] = await db.query(sql, values);
      return result.affectedRows > 0;
    } catch (e) {
      console.error(`Error in update: ${e.message}`);
      return false;
    }
  }

  async delete(id) {
    try {
      const sql = `DELETE FROM ${this.table} WHERE id = ?`;
      const [result] = await db.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (e) {
      console.error(`Error in delete: ${e.message}`);
      return false;
    }
  }

  async query(query, params = []) {
    try {
      const [result] = await db.query(query, params);
      const lowerQuery = query.trim().toLowerCase();

      if (lowerQuery.startsWith("select")) {
        return result;
      } else if (lowerQuery.startsWith("insert")) {
        return result.insertId;
      } else if (
        lowerQuery.startsWith("update") ||
        lowerQuery.startsWith("delete")
      ) {
        return result.affectedRows > 0;
      }
      return result;
    } catch (e) {
      console.error(`Error in query execution: ${e.message}`);
      return null;
    }
  }
}

module.exports = SQLModel;
