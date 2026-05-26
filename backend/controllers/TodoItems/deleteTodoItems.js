// const {
//   verifyItemOwnership,
//   deleteTodoItem,
// } = require("../../services/todoItemService");

// const deleteItem = async (req, res) => {
//   try {
//     const itemId = Number(req.params.itemId);

//     if (!Number.isInteger(itemId)) {
//       return res.status(400).json({
//         error: "Invalid item id",
//       });
//     }

//     const userId = req.user.id;

//     const hasAccess = await verifyItemOwnership(itemId, userId);

//     if (!hasAccess) {
//       return res.status(403).json({
//         error: "You do not have permission to delete this item",
//       });
//     }

//     const result = await deleteTodoItem(itemId);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         error: "Todo item not found",
//       });
//     }

//     res.status(200).json({
//       message: "Todo item deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// module.exports = { deleteItem };
