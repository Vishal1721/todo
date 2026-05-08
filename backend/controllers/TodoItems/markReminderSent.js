const { markReminderSent } = require("../../services/todoItemService");

const markReminder = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        error: "Invalid item id",
      });
    }

    const userId = req.user.id;

    const result = await markReminderSent(itemId, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Todo item not found or access denied",
      });
    }

    res.status(200).json({
      message: "Reminder marked as sent",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { markReminder };
