@@ .. @@
 import { useState, useEffect, useRef } from 'react';
 import Button from '../ui/Button';
-import Container from '../layout/Container';
-import Section from '../layout/Section';
 import styles from './FeatureSection.module.css';

 function FeatureSection({ 
@@ .. @@
   };

   return (
-    <Section background={background}>
-      <Container>
+    <section className="py-5" style={{ backgroundColor: background }}>
+      <div className="container">
         <div 
           ref={sectionRef}
           className={`row align-items-center ${styles.feature} ${
@@ -65,8 +63,8 @@ function FeatureSection({
             />
           </div>
         </div>
-      </Container>
-    </Section>
+      </div>
+    </section>
   );
 }