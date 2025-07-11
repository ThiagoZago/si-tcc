@@ .. @@
 import { useState } from 'react';
 import { Link } from 'react-router-dom';
 import Button from '../ui/Button';
-import Container from '../layout/Container';
 import styles from './Hero.module.css';

-const slides = [
-  {
-    title: 'Quer marcar um horário?',
-    buttons: [
-      { to: '/agendar', text: 'pelo whatsapp', variant: 'secondary' },
-      { to: '/agendar', text: 'pelo site', variant: 'outline' }
-    ]
-  },
-  {
-    title: 'Seja nosso parceiro!',
-    buttons: [
-      { to: '/acesso', text: 'VAMOS NESSA!', variant: 'primary' }
-    ]
-  }
-];
-
 function Hero() {
   const [isHoveredPrev, setIsHoveredPrev] = useState(false);
   const [isHoveredNext, setIsHoveredNext] = useState(false);

@@ .. @@

   return (
     <section className={styles.hero} id="home">
-      <Container>
+      <div className="container">
         <div className="row">
           <div className="col-12 text-center">
             <div id="carousel-hero" className="carousel slide" data-bs-ride="carousel">
               <div className="carousel-inner">
-                {slides.map((slide, index) => (
-                  <div 
-                    key={index} 
-                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
-                  >
-                    <h1 className={styles.title}>{slide.title}</h1>
-                    <div className={styles.buttonGroup}>
-                      {slide.buttons.map((button, btnIndex) => (
-                        <Button
-                          key={btnIndex}
-                          to={button.to}
-                          variant={button.variant}
-                          className="mx-2"
-                        >
-                          {button.text}
-                        </Button>
-                      ))}
+                <div className="carousel-item active">
+                  <h1 className={styles.title}>Quer marcar um horário?</h1>
+                  <div className={styles.buttonGroup}>
+                    <Button to="/agendar" variant="secondary" className="mx-2">
+                      pelo whatsapp
+                    </Button>
+                    <Button to="/agendar" variant="outline" className="mx-2">
+                      pelo site
+                    </Button>
+                  </div>
+                </div>
+                <div className="carousel-item">
+                  <h1 className={styles.title}>Seja nosso parceiro!</h1>
+                  <div className={styles.buttonGroup}>
+                    <Button to="/acesso" variant="primary" className="mx-2">
+                      VAMOS NESSA!
+                    </Button>
                     </div>
-                  </div>
-                ))}
+                </div>
               </div>
               
               <Link
@@ -85,7 +65,7 @@ function Hero() {
             </div>
           </div>
         </div>
-      </Container>
+      </div>
     </section>
   );
 }