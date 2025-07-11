@@ .. @@
-import Container from "../layout/Container";
-import Section from "../layout/Section";
-
 const faqItems = [
@@ .. @@

 function Help() {
   return (
-    <Section padding="py-5">
-      <Container>
+    <section className="py-5">
+      <div className="container">
         <div className="row justify-content-center">
           <div className="col-12 col-lg-8">
             <h2 className="text-center mb-5">Perguntas Frequentes</h2>
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