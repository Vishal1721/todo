const {
  verifyListOwnership,
  getTodoStats,
} = require("../../services/todoItemService");

const getStats = async (req, res) => {
  try {
    const listId = Number(req.params.listId);

    if (!Number.isInteger(listId)) {
      return res.status(400).json({
        error: "Invalid list id",
      });
    }

    const userId = req.user.id;

    const hasAccess = await verifyListOwnership(listId, userId);

    if (!hasAccess) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    const stats = await getTodoStats(listId);

    res.status(200).json({
      message: "Stats fetched successfully",
      stats: {
        total: Number(stats.total),
        completed: Number(stats.completed || 0),
        pending: Number(stats.pending || 0),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getStats };
