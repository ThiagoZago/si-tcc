@@ .. @@
 import { Link } from 'react-router-dom';
-import Container from '../layout/Container';
-import Section from '../layout/Section';
 import Card from '../ui/Card';
 import Button from '../ui/Button';
 import styles from './ArticleGrid.module.css';

@@ .. @@

 function ArticleGrid() {
   return (
-    <Section padding="py-5" background="#f8f9fa">
-      <Container>
+    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
+      <div className="container">
         <div className="row">
           {articles.map((article, index) => (
             <div key={index} className="col-md-4 mb-4">
@@ -50,8 +48,8 @@ function ArticleGrid() {
             </div>
           ))}
         </div>
-      </Container>
-    </Section>
+      </div>
+    </section>
   );
 }