@@ .. @@
-import styles from './Card.module.css';
-
-function Card({ children, className = '', animated = false, ...props }) {
+function Card({ children, className = '', animated = false, ...props }) {
   return (
     <div 
-      className={`${styles.card} ${animated ? styles.animated : ''} ${className}`}
+      className={`card ${animated ? 'fade-in' : ''} ${className}`}
       {...props}
     >
-      {children}
+      <div className="card-body">
+        {children}
+      </div>
     </div>
   );
 }