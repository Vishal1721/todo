const db = require("../config/db");
const redisClient = require("../config/redis")

const createList = async (userId, name, isPublic = 0) => {
  const [result] = await db.query(
    "INSERT INTO todolists (user_id, name, is_public) VALUES (?, ?, ?)",
    [userId, name, isPublic],
  );

  return {
    id: result.insertId,
    name,
    user_id: userId,
    is_public: isPublic,
  };
};

const getUserTodoLists = async (userId) => {
  const cacheKey = `todo:lists:${listId}`;
  const [rows] = await db.query(
    "SELECT id, name, share_token, is_public, created_at FROM todolists WHERE user_id = ?",
    [userId],
  );
  await redisClient.setEx(cacheKey, 30, JSON.stringify(rows));
  return rows;
};

const updateTodoList = async (listId, userId, updates) => {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }

  if (updates.is_public !== undefined) {
    fields.push("is_public = ?");
    values.push(updates.is_public);
  }

  values.push(listId, userId);

  const [result] = await db.query(
    `UPDATE todolists
     SET ${fields.join(", ")}
     WHERE id = ? AND user_id = ?`,
    values,
  );

  return result;
};

const deleteTodoList = async (listId, userId) => {
  const [result] = await db.query(
    "DELETE FROM todolists WHERE id = ? AND user_id = ?",
    [listId, userId],
  );

  return result;
};

module.exports = {
  createList,
  getUserTodoLists,
  updateTodoList,
  deleteTodoList
};

