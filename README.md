# 🚀 SmoothAlert Pro 2.0

A beautiful, modern alert library with glassmorphism design and smooth animations. Pure JavaScript, no dependencies.

![SmoothAlert Pro](https://img.shields.io/badge/SmoothAlert-Pro%202.0-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-green?style=for-the-badge)

## ✨ Features

- 🎨 **Glassmorphism Design** - Modern frosted glass effect
- 🌈 **Multiple Alert Types** - Success, error, warning, info, and custom
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎭 **Smooth Animations** - Beautiful CSS transitions and transforms
- 🌙 **Dark Mode Support** - Automatic theme detection
- 🍞 **Toast Notifications** - Non-blocking notifications with progress bars
- ⚡ **Lightweight** - Pure JavaScript, no dependencies
- 🎯 **Easy to Use** - Simple API, quick setup

## 🚀 Quick Start

### 1. Include the Files

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your App</title>
</head>
<body>
    <!-- Your content -->
    
    <!-- Include SmoothAlert -->
    <script src="smoothalert.js"></script>
</body>
</html>
```

### 2. Basic Usage

```javascript
// Simple alert
SmoothAlert.show({
    type: 'success',
    title: 'Success!',
    message: 'Your action was completed successfully.'
});

// Toast notification
SmoothAlert.toast({
    type: 'info',
    message: 'This is a toast notification!',
    duration: 3000
});

// Confirmation dialog
SmoothAlert.confirm({
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    onConfirm: () => {
        console.log('User confirmed');
    },
    onCancel: () => {
        console.log('User cancelled');
    }
});
```

## 📖 API Reference

### SmoothAlert.show(options)

Display a modal alert.

**Options:**
- `type` (string): 'success', 'error', 'warning', 'info', 'custom'
- `title` (string): Alert title
- `message` (string): Alert message
- `confirmText` (string): Confirm button text (default: 'OK')
- `onConfirm` (function): Callback when confirmed
- `customClass` (string): Custom CSS class
- `autoClose` (number): Auto-close after milliseconds

### SmoothAlert.toast(options)

Display a toast notification.

**Options:**
- `type` (string): 'success', 'error', 'warning', 'info'
- `message` (string): Toast message
- `duration` (number): Display duration in milliseconds (default: 3000)
- `position` (string): 'top-right', 'top-left', 'bottom-right', 'bottom-left'

### SmoothAlert.confirm(options)

Display a confirmation dialog.

**Options:**
- `title` (string): Dialog title
- `message` (string): Dialog message
- `confirmText` (string): Confirm button text (default: 'Yes')
- `cancelText` (string): Cancel button text (default: 'No')
- `onConfirm` (function): Callback when confirmed
- `onCancel` (function): Callback when cancelled

## 🎨 Customization

### Custom Themes

```javascript
// Custom alert with your own styling
SmoothAlert.show({
    type: 'custom',
    title: 'Custom Alert',
    message: 'This alert uses custom styling.',
    customClass: 'my-custom-alert'
});
```

```css
.my-custom-alert {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

### Animation Customization

The library uses CSS custom properties for easy theming:

```css
:root {
    --sa-primary-color: #3b82f6;
    --sa-success-color: #10b981;
    --sa-error-color: #ef4444;
    --sa-warning-color: #f59e0b;
    --sa-info-color: #06b6d4;
    --sa-animation-duration: 0.3s;
    --sa-border-radius: 12px;
}
```

## 🌟 Examples

### Success Alert
```javascript
SmoothAlert.show({
    type: 'success',
    title: 'Great!',
    message: 'Your profile has been updated successfully.',
    confirmText: 'Awesome!'
});
```

### Error Alert with Callback
```javascript
SmoothAlert.show({
    type: 'error',
    title: 'Oops!',
    message: 'Something went wrong. Please try again.',
    onConfirm: () => {
        // Retry logic here
        location.reload();
    }
});
```

### Auto-closing Toast
```javascript
SmoothAlert.toast({
    type: 'info',
    message: 'File uploaded successfully!',
    duration: 2000,
    position: 'top-right'
});
```

## 🔧 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by fabiantaboo 