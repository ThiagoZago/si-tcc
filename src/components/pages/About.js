@@ .. @@
-import Container from "../layout/Container";
-import Section from "../layout/Section";
 import Card from "../ui/Card";

 function About() {
   return (
-    <Section padding="py-5">
-      <Container>
+    <section className="py-5">
+      <div className="container">
         <div className="row justify-content-center">
           <div className="col-12 col-lg-8">
             <Card>
@@ .. @@
             </Card>
           </div>
         </div>
-      </Container>
-    </Section>
+      </div>
+    </section>
   );
 }