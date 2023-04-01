const express = require('express');

const { registerUser, loginUser, logout, forgot, resetPassward, getUserProfile,updatePassward, updateProfile, allUsers, getUserDetails, updateUserProfile, deleteUser, getSingleUser } = require('../controller/authController');
const router = require('./product');
const userRouter=express.Router()

const{isAuthenticatedUser,authorizeRoles}=require('../middleware/auth');



router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateUserProfile)
router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
router.route('/user/register').post( registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/me').get(isAuthenticatedUser,getUserProfile)
router.route('/passward/update').put(isAuthenticatedUser,updatePassward)
router.route('/user/update/:id').put(isAuthenticatedUser,updateProfile)
router.route('/passward/forgot').post(forgot)
router.route('/passward/reset/:token').put(resetPassward)
router.route('/user/:id').get(isAuthenticatedUser,getSingleUser)
module.exports=userRouter  