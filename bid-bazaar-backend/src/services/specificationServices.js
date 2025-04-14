const SQLModel = require("../util/sqlModel");

class Specifications extends SQLModel {
  constructor() {
    super("Specifications");
  }

  async getSpecifications(categoryId) {
    const rows = await this.query(
      `
            SELECT 
                specifications.id AS specificationId, 
                specifications.name, 
                specifications.hintText, 
                specifications.required, 
                specifications.type, 
                options.id AS optionId, 
                options.name AS optionName
            FROM specifications 
            LEFT JOIN options ON specifications.id = options.specificationID
            WHERE specifications.categoryId = ?;`,
      [categoryId]
    );

    const specificationsMap = new Map();

    rows.forEach((row) => {
      if (!specificationsMap.has(row.specificationId)) {
        specificationsMap.set(row.specificationId, {
          id: row.specificationId,
          name: row.name,
          hintText: row.hintText,
          required: row.required,
          type: row.type,
          options: [],
        });
      }

      if (row.optionId) {
        specificationsMap.get(row.specificationId).options.push({
          value: row.optionName,
          label: row.optionName,
        });
      }
    });

    return Array.from(specificationsMap.values());
  }
}

module.exports = { Specifications: new Specifications() };
