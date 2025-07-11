@@ .. @@
 import { useState } from "react";
 import axios from "axios";
 import { padronizarTelefone } from "../../services/phoneNumber";
-import Container from "../layout/Container";
-import Section from "../layout/Section";
 import Card from "../ui/Card";
 import Input from "../ui/Input";
 import Button from "../ui/Button";
 import Alert from "../ui/Alert";

@@ .. @@

   return (
-    <Section padding="py-5">
-      <Container>
+    <section className="py-5">
+      <div className="container">
         <div className="row justify-content-center">
           <div className="col-12 col-md-8 col-lg-6">
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