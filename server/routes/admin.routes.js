import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  updateAdminRole,
  deleteAdmin,
  updateAdminPermissions,
  getLowStockAlerts,
  getUsers,
  getUserById,
  verifyUserEmail,
  deleteUser,
  updateUserDetails,
} from "../controllers/admin.controller.js";
import {
  verifyAdminJWT,
  hasPermission,
  hasRole,
} from "../middlewares/admin.middleware.js";

const router = express.Router();

// Admin Auth Routes
router.post("/login", loginAdmin);

// Register admin - require authentication and Super Admin role
router.post("/register", verifyAdminJWT, hasRole("SUPER_ADMIN"), registerAdmin);

// Admin Profile Routes
router.get("/profile", verifyAdminJWT, getAdminProfile);
router.patch("/profile", verifyAdminJWT, updateAdminProfile);
router.post("/change-password", verifyAdminJWT, changeAdminPassword);

// Dashboard Routes
router.get(
  "/inventory-alerts",
  verifyAdminJWT,
  hasPermission("inventory", "read"),
  getLowStockAlerts
);

// Admin Management Routes (Super Admin Only)
router.get("/admins", verifyAdminJWT, hasRole("SUPER_ADMIN"), getAllAdmins);

router.patch(
  "/admins/:adminId",
  verifyAdminJWT,
  hasRole("SUPER_ADMIN"),
  updateAdminRole
);

router.delete(
  "/admins/:adminId",
  verifyAdminJWT,
  hasRole("SUPER_ADMIN"),
  deleteAdmin
);

// Update admin permissions (can be used to fix missing permissions)
router.post(
  "/admins/:adminId/update-permissions",
  verifyAdminJWT,
  hasRole("SUPER_ADMIN"),
  updateAdminPermissions
);

// User Management Routes
router.get("/users", verifyAdminJWT, hasPermission("users", "read"), getUsers);

router.get(
  "/users/:userId",
  verifyAdminJWT,
  hasPermission("users", "read"),
  getUserById
);

router.post(
  "/users/:userId/verify-email",
  verifyAdminJWT,
  hasPermission("users", "update"),
  verifyUserEmail
);

router.patch(
  "/users/:userId",
  verifyAdminJWT,
  hasPermission("users", "update"),
  updateUserDetails
);

router.delete(
  "/users/:userId",
  verifyAdminJWT,
  hasPermission("users", "delete"),
  deleteUser
);

export default router;
