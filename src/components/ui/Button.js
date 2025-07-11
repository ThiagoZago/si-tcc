@@ .. @@
-import { useState } from 'react';
-import { Link } from 'react-router-dom';
-
-function Button({ 
-  to, 
-  children, 
-  variant = 'primary', 
-  size = 'md',
-  onClick,
-  type = 'button',
-  className = '',
-  ...props 
-}) {
-  const [isHovered, setIsHovered] = useState(false);
-
-  const variants = {
-    primary: {
-      background: isHovered ? '#5f0b0b' : '#b91616',
-      color: '#fff',
-      border: '1px solid #b91616'
-    },
-    secondary: {
-      background: isHovered ? '#5f0b0b' : 'transparent',
-      color: '#fff',
-      border: '1px solid rgba(255,255,255,0.5)'
-    },
-    outline: {
-      background: isHovered ? '#5f0b0b' : 'rgba(255,255,255,0.9)',
-      color: isHovered ? '#fff' : '#000',
-      border: '1px solid #2c2c2c'
-    }
-  };
-
-  const sizes = {
-    sm: { padding: '8px 16px', fontSize: '0.875rem' },
-    md: { padding: '10px 20px', fontSize: '1rem' },
-    lg: { padding: '12px 24px', fontSize: '1.125rem' }
-  };
-
-  const buttonStyle = {
-    ...variants[variant],
-    ...sizes[size],
-    borderRadius: '100px',
-    textTransform: 'uppercase',
-    fontWeight: '600',
-    textDecoration: 'none',
-    display: 'inline-block',
-    textAlign: 'center',
-    transition: 'all 0.3s ease',
-    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
-    cursor: 'pointer'
-  };
-
-  const handleMouseEnter = () => setIsHovered(true);
-  const handleMouseLeave = () => setIsHovered(false);
-
-  if (to) {
-    return (
-      <Link
-        to={to}
-        style={buttonStyle}
-        className={`btn ${className}`}
-        onMouseEnter={handleMouseEnter}
-        onMouseLeave={handleMouseLeave}
-        {...props}
-      >
-        {children}
-      </Link>
-    );
-  }
-
-  return (
-    <button
-      type={type}
-      style={buttonStyle}
-      className={`btn ${className}`}
-      onMouseEnter={handleMouseEnter}
-      onMouseLeave={handleMouseLeave}
-      onClick={onClick}
-      {...props}
-    >
-      {children}
-    </button>
-  );
-}
+import { Link } from 'react-router-dom';
+
+function Button({ 
+  to, 
+  children, 
+  variant = 'primary', 
+  size = 'md',
+  onClick,
+  type = 'button',
+  className = '',
+  ...props 
+}) {
+  // Mapear variantes para classes Bootstrap
+  const getBootstrapClass = () => {
+    const baseClass = 'btn';
+    const variantClass = variant === 'outline' ? 'btn-outline-danger' : `btn-${variant === 'primary' ? 'danger' : variant}`;
+    const sizeClass = size !== 'md' ? `btn-${size}` : '';
+    
+    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
+  };
+
+  if (to) {
+    return (
+      <Link
+        to={to}
+        className={getBootstrapClass()}
+        role="button"
+        {...props}
+      >
+        {children}
+      </Link>
+    );
+  }
+
+  return (
+    <button
+      type={type}
+      className={getBootstrapClass()}
+      onClick={onClick}
+      {...props}
+    >
+      {children}
+    </button>
+  );
+}

export default Button