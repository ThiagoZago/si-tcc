import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './ArticleGrid.module.css';

function ArticleGrid() {
  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          {articles.map((article, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Card>
                <img
                  src={article.image}
                  alt={article.title}
                  className={styles.articleImage}
                />
                <div className="p-3">
                  <h3 className="h5 mb-3">{article.title}</h3>
                  <p className="mb-3">{article.excerpt}</p>
                  <Link to={article.link}>
                    <Button variant="primary">Read More</Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticleGrid;