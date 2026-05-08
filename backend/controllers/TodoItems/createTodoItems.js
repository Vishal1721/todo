const Joi = require("joi");

const {
  verifyListOwnership,
  createTodoItem,
} = require("../../services/todoItemService");

const createItem = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(255).required(),
    position: Joi.number().integer().min(0).optional(),
    reminder_at: Joi.date().optional(),
    tags: Joi.array()
      .items(Joi.number().integer().positive())
      .optional()
      .default([]),
  });

  try {
    const listId = Number(req.params.listId);

    if (!Number.isInteger(listId)) {
      return res.status(400).json({
        error: "Invalid list id",
      });
    }

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const userId = req.user.id;

    const hasAccess = await verifyListOwnership(listId, userId);

    if (!hasAccess) {
      return res.status(403).json({
        error: "You do not have access to this todo list",
      });
    }
    const tagsValue = JSON.stringify(value.tags || []);
    const item = await createTodoItem(
      listId,
      value.title,
      value.position ?? 0,
      value.reminder_at ?? null,
      tagsValue,
    );

    res.status(201).json({
      message: "Todo item created successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { createItem };
