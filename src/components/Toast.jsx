// components/Toast.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            default:
                return "bg-blue-500";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 ${getBackgroundColor()} text-white px-6 py-3 rounded-lg shadow-lg z-50 min-w-64`}
        >
            <div className="flex items-center justify-between">
                <span className="font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200 transition-colors"
                >
                    ✕
                </button>
            </div>
        </motion.div>
    );
};

export default Toast;