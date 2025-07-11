@@ .. @@
 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { register } from "../../services/authService";
 import Card from "../ui/Card";
 import Input from "../ui/Input";
 import Button from "../ui/Button";
 import Alert from "../ui/Alert";
 import styles from "./Register.module.css";

@@ .. @@

   return (
     <div className={styles.container}>
-      <div className="col-12 col-md-6 col-lg-4">
-        <Card animated>
-          <h2 className="text-center mb-4">Criar conta</h2>
-          
-          {message && (
-            <Alert type={isSuccess ? "success" : "danger"}>
-              {message}
-            </Alert>
-          )}
-
-          <form onSubmit={handleSubmit}>
-            <Input
-              id="username"
-              name="username"
-              type="email"
-              label="Email"
-              placeholder="seu@email.com"
-              value={formData.username}
-              onChange={handleChange}
-              required
-            />
-
-            <Input
-              id="password"
-              name="password"
-              label="Senha"
-              placeholder="Crie uma senha segura"
-              value={formData.password}
-              onChange={handleChange}
-              showPasswordToggle
-              required
-            />
-
-            <div className={styles.requirements}>
-              <small className="text-muted">Requisitos da senha:</small>
-              <ul className={styles.requirementsList}>
-                {passwordRequirements.map((req, index) => (
-                  <li key={index}>{req}</li>
-                ))}
-              </ul>
-            </div>
-
-            <Button
-              type="submit"
-              variant="primary"
-              className="w-100"
-              disabled={isLoading}
-            >
-              {isLoading ? "Criando conta..." : "Criar Conta"}
-            </Button>
-          </form>
-        </Card>
+      <div className="row justify-content-center">
+        <div className="col-12 col-md-6 col-lg-4">
+          <Card animated>
+            <h2 className="text-center mb-4">Criar conta</h2>
+            
+            {message && (
+              <Alert type={isSuccess ? "success" : "danger"}>
+                {message}
+              </Alert>
+            )}
+
+            <form onSubmit={handleSubmit}>
+              <Input
+                id="username"
+                name="username"
+                type="email"
+                label="Email"
+                placeholder="seu@email.com"
+                value={formData.username}
+                onChange={handleChange}
+                required
+              />
+
+              <Input
+                id="password"
+                name="password"
+                label="Senha"
+                placeholder="Crie uma senha segura"
+                value={formData.password}
+                onChange={handleChange}
+                showPasswordToggle
+                required
+              />
+
+              <div className={styles.requirements}>
+                <small className="text-muted">Requisitos da senha:</small>
+                <ul className={styles.requirementsList}>
+                  {passwordRequirements.map((req, index) => (
+                    <li key={index}>{req}</li>
+                  ))}
+                </ul>
+              </div>
+
+              <Button
+                type="submit"
+                variant="primary"
+                className="w-100"
+                disabled={isLoading}
+              >
+                {isLoading ? "Criando conta..." : "Criar Conta"}
+              </Button>
+            </form>
+          </Card>
+        </div>
       </div>
     </div>
   );
 }