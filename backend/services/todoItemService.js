const db = require("../config/db");
const redisClient = require("../config/redis")
const verifyListOwnership = async (listId, userId) => {
  const [rows] = await db.query(
    "SELECT id FROM todolists WHERE id = ? AND user_id = ?",
    [listId, userId],
  );

  return rows.length > 0;
};

const GetTodoItems = async (listId) => {
    const result = redisClient.get(`todo:items:${listId}`);
    if()
  const cacheKey = `todo:items:${listId}`;

  const [rows] = await db.query(
    "SELECT id, list_id, title, is_completed, position, reminder_at, reminder_sent FROM todoitems WHERE list_id = ?",
    [listId],
  );

  await redisClient.setEx(cacheKey, 30, JSON.stringify(rows));
  return rows;
};


const createTodoItem = async (listId, title, position, reminderAt, tags) => {
  const [result] = await db.execute(
    `INSERT INTO todoitems (list_id, title, position, reminder_at, tags) 
     VALUES (?, ?, ?, ?, ?)`,
    [listId, title, position, reminderAt, tags],
  );
  await redisClient.del(`todo:items:${listId}`);

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
  await redisClient.del(`todo:items:${listId}`);

  return result;
};

const deleteTodoItem = async (itemId) => {
  const [result] = await db.query("DELETE FROM todoitems WHERE id = ?", [
    itemId,
  ]);

  return result;
};
// const markReminderSent = async (itemId, userId) => {
//   const [result] = await db.query(
//     `
//     UPDATE todoitems ti
//     JOIN todolists tl ON ti.list_id = tl.id
//     SET ti.reminder_sent = 1
//     WHERE ti.id = ? AND tl.user_id = ?
//     `,
//     [itemId, userId],
//   );

//   return result;
// };
// const getTodoStats = async (listId) => {
//   const [rows] = await db.query(
//     `
//     SELECT
//       COUNT(*) AS total,
//       SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS completed,
//       SUM(CASE WHEN is_completed = 0 THEN 1 ELSE 0 END) AS pending
//     FROM todoitems
//     WHERE list_id = ?
//     `,
//     [listId],
//   );

//   return rows[0];
// };
module.exports = {
  verifyListOwnership,
  createTodoItem,
  updateTodoItem,
  verifyItemOwnership,
  GetTodoItems,
  deleteTodoItem,
};
