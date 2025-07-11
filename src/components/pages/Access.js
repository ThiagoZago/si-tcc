@@ .. @@
 import { useState, useEffect } from "react";
 import { useNavigate, Link } from "react-router-dom";
 import { login } from "../../services/authService";
 import Card from "../ui/Card";
 import Input from "../ui/Input";
 import Button from "../ui/Button";
 import Alert from "../ui/Alert";
 import styles from "./Access.module.css";

 function Access() {
@@ .. @@

   return (
     <div className={styles.container}>
-      <div className="col-12 col-md-6 col-lg-4">
-        <Card animated>
-          <h2 className="text-center mb-4">Acesse sua conta</h2>
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
-              placeholder="Sua senha"
-              value={formData.password}
-              onChange={handleChange}
-              showPasswordToggle
-              required
-            />
-
-            <Button
-              type="submit"
-              variant="primary"
-              className="w-100 mb-3"
-              disabled={isLoading}
-            >
-              {isLoading ? "Entrando..." : "Entrar"}
-            </Button>
-          </form>
-
-          <div className="text-center">
-            <p className="mb-2">Ainda não tem uma conta?</p>
-            <Link to="/registro" className="btn btn-outline-danger w-100">
-              Criar Conta
-            </Link>
+      <div className="row justify-content-center">
+        <div className="col-12 col-md-6 col-lg-4">
+          <Card animated>
+            <h2 className="text-center mb-4">Acesse sua conta</h2>
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
+                placeholder="Sua senha"
+                value={formData.password}
+                onChange={handleChange}
+                showPasswordToggle
+                required
+              />
+
+              <Button
+                type="submit"
+                variant="primary"
+                className="w-100 mb-3"
+                disabled={isLoading}
+              >
+                {isLoading ? "Entrando..." : "Entrar"}
+              </Button>
+            </form>
+
+            <div className="text-center">
+              <p className="mb-2">Ainda não tem uma conta?</p>
+              <Link to="/registro" className="btn btn-outline-danger w-100">
+                Criar Conta
+              </Link>
+            </div>
+          </Card>
+        </div>
       </div>
-        </Card>
-      </div>
     </div>
   );
 }