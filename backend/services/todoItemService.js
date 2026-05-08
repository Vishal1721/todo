const db = require("../config/db");

const verifyListOwnership = async (listId, userId) => {
  const [rows] = await db.query(
    "SELECT id FROM todolists WHERE id = ? AND user_id = ?",
    [listId, userId],
  );

  return rows.length > 0;
};

const GetTodoItems = async (listId) => {
  const [rows] = await db.query(
    "SELECT id, list_id, , title,  is_completed,position,remainder_at,remainder_sent FROM todoitems WHERE list_id = ?",
    [userId],
  );
  return rows;
};

const createTodoItem = async (listId, title, position, reminderAt, tags) => {
  const [result] = await db.execute(
    `INSERT INTO todoitems (list_id, title, position, reminder_at, tags) 
     VALUES (?, ?, ?, ?, ?)`,
    [listId, title, position, reminderAt, tags],
  );

  return {
    id: result.insertId,
    list_id: listId,
    title,
    position,
    reminder_at: reminderAt,
    tags: JSON.parse(tags), 
  };
};

const verifyItemOwnership = async (itemId, userId) => {
  const [rows] = await db.query(
    `
    SELECT ti.id
    FROM todoitems ti
    JOIN todolists tl ON ti.list_id = tl.id
    WHERE ti.id = ? AND tl.user_id = ?
    `,
    [itemId, userId],
  );

  return rows.length > 0;
};

const updateTodoItem = async (itemId, updates) => {

  const [existingRows] = await db.query(
    "SELECT * FROM todoitems WHERE id = ?",
    [itemId],
  );

  if (existingRows.length === 0) {
    throw new Error("Item not found");
  }

  const oldData = existingRows[0];

  const fields = [];
  const values = [];


  const addField = (columnName, newValue, oldValue) => {
    if (newValue !== undefined && newValue !== oldValue) {
      fields.push(`${columnName} = ?`);
      values.push(newValue);
    }
  };

  addField("title", updates.title, oldData.title);
  addField("is_completed", updates.is_completed, oldData.is_completed);
  addField("position", updates.position, oldData.position);
  addField("reminder_at", updates.reminder_at, oldData.reminder_at);

  if (fields.length === 0) {
    return { message: "No changes detected", affectedRows: 0 };
  }

  values.push(itemId);
  const [result] = await db.query(
    `UPDATE todoitems SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  return result;
};


module.exports = {
  verifyListOwnership,
  createTodoItem,
  updateTodoItem,
  verifyItemOwnership,
  GetTodoItems,
};
