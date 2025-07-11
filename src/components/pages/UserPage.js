@@ .. @@
 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { logout } from "../../services/authService";
-import Container from "../layout/Container";
 import Button from "../ui/Button";
 import styles from "./UserPage.module.css";

@@ .. @@

   return (
     <div className={styles.container}>
       <div className={styles.header}>
-        <Container>
+        <div className="container">
           <div className="d-flex justify-content-between align-items-center">
             <h3 className="mb-0 text-white">Painel do Usuário</h3>
             <Button variant="secondary" onClick={handleLogout}>
               <i className="fas fa-sign-out-alt me-2"></i>
               Sair
             </Button>
           </div>
-        </Container>
+        </div>
       </div>

-      <Container>
+      <div className="container">
         <div className={styles.content}>
           <ul className={`nav nav-tabs ${styles.tabs}`}>
@@ .. @@
             {renderTabContent()}
           </div>
         </div>
-      </Container>
+      </div>
     </div>
   );
 }