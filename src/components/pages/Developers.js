@@ .. @@
-import Container from "../layout/Container";
-import Section from "../layout/Section";
 import Card from "../ui/Card";

@@ .. @@

 function Developers() {
   return (
-    <Section padding="py-5">
-      <Container>
+    <section className="py-5">
+      <div className="container">
         <div className="row justify-content-center">
           <div className="col-12 col-lg-10">
             <div className="text-center mb-5">
@@ .. @@
             </div>
           </div>
         </div>
-      </Container>
-    </Section>
+      </div>
+    </section>
   );
 }