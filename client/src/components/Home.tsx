import React from "react";
import { Link, useLocation } from "react-router-dom";
import './App.css'; // Ensure this is imported

const Home: React.FC = () => {
  const location = useLocation();
  

  return (
    <div>
      <h2>Select Category</h2>
      <ul className="container">
        <li className="card">
          <img src="/images/word.jpeg" alt="Words" />
          <div className="card-content">
            <h3>Words</h3>
            <p>Learn Spelling</p>
            <Link to="/words" className="enroll-link">
              <button 
                className={location.pathname === "/words" ? "active" : ""} 
                aria-pressed={location.pathname === "/words"} 
                tabIndex={-1}
                aria-label="Enroll in Words category"
              >
                Enroll
              </button>
            </Link>
          </div>
        </li>
        <li className="card" role="listitem">
          <img src="/images/Sentences.jpeg" alt="Sentences" />
          <div className="card-content">
            <h3>Sentences</h3>
            <p>Learn Spelling</p>
            <Link to="/sentences" className="enroll-link">
              <button 
                className={location.pathname === "/sentences" ? "active" : ""} 
                aria-pressed={location.pathname === "/sentences"} 
                tabIndex={-1}
                aria-label="Enroll in Sentences category"
              >
                Enroll
              </button>
            </Link>
          </div>
        </li>
        <li className="card" role="listitem">
          <img src="/images/Articles.jpeg" alt="Articles" />
          <div className="card-content">
            <h3>Articles</h3>
            <p>Learn Spelling</p>
            <Link to="/articles" className="enroll-link">
              <button 
                className={location.pathname === "/articles" ? "active" : ""} 
                aria-pressed={location.pathname === "/articles"} 
                tabIndex={-1}
                aria-label="Enroll in Articles category"
              >
                Enroll
              </button>
            </Link>
          </div>
        </li>
        <li className="card" role="listitem">
          <img src="/images/tenses.jpeg" alt="Tenses" />
          <div className="card-content">
            <h3>Tenses</h3>
            <p>Learn Spelling</p>
            <Link to="/tenses" className="enroll-link">
              <button 
                className={location.pathname === "/tenses" ? "active" : ""} 
                aria-pressed={location.pathname === "/tenses"} 
                tabIndex={-1}
                aria-label="Enroll in Tenses category"
              >
                Enroll
              </button>
            </Link>
          </div>
        </li>
        <li className="card" role="listitem">
          <img src="/images/minicourse.jpeg" alt="Tenses1" />
          <div className="card-content">
            <h3>Tenses1</h3>
            <p>Learn Spelling</p>
            <Link to="/tenses1" className="enroll-link">
              <button 
                className={location.pathname === "/tenses1" ? "active" : ""} 
                aria-pressed={location.pathname === "/tenses1"} 
                tabIndex={-1}
                aria-label="Enroll in Tenses1 category"
              >
                Enroll
              </button>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Home;
