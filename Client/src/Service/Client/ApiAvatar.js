const express = require('express');
const multer = require('multer');
const path = require('path');
const Users = require('../../models/User');

const router = express.Router();

// Cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file tránh trùng lặp
    }
});

const upload = multer({ storage });

// API cập nhật avatar
router.post('/upload-avatar/:userId', upload.single('avatar'), async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Lưu đường dẫn ảnh vào database
        const avatarUrl = `/uploads/${req.file.filename}`; // Đường dẫn ảnh
        await Users.findByIdAndUpdate(userId, { avatar: avatarUrl });

        res.json({ message: "Avatar updated successfully!", avatar: avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating avatar" });
    }
});

module.exports = router;
