import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import { assets } from '../../assets/assets';

const highlights = [
  { title: 'Fast delivery', text: 'Hot meals delivered in minutes, not hours.' },
  { title: 'Fresh & trusted', text: 'Partner restaurants are hand-picked for quality.' },
  { title: 'Easy payments', text: 'Secure checkout with cards, wallets, and COD.' },
];

const values = [
  'Fresh ingredients and chef-crafted meals every day',
  'Transparent pricing with no hidden surprises',
  'Friendly support that helps whenever you need it',
];

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-eyebrow">About BiteGo</p>
          <h1>Delicious food, delivered with heart.</h1>
          <p>
            BiteGo brings your favorite local flavors right to your doorstep with
            a seamless ordering experience, lightning-fast delivery, and a promise
            of freshness in every bite.
          </p>
          <div className="about-hero-actions">
            <Link to="/" className="about-btn primary">Order now</Link>
            <a href="#story" className="about-btn secondary">Discover our story</a>
          </div>
        </div>
        <div className="about-hero-card">
          <img src={assets.logo} alt="BiteGo logo" />
          <h3>Why food lovers choose BiteGo</h3>
          <ul>
            <li>Live tracking for every order</li>
            <li>Curated restaurants with verified ratings</li>
            <li>Special offers for every craving</li>
          </ul>
        </div>
      </section>

      <section className="about-stats">
        <div>
          <strong>50k+</strong>
          <span>happy orders</span>
        </div>
        <div>
          <strong>15 min</strong>
          <span>average delivery</span>
        </div>
        <div>
          <strong>100+</strong>
          <span>partner restaurants</span>
        </div>
      </section>

      <section className="about-grid" id="story">
        <div className="about-card wide">
          <p className="about-eyebrow">Our mission</p>
          <h2>Making everyday meals feel special.</h2>
          <p>
            We started with a simple idea: great food should be easy to get, easy to
            enjoy, and easy to love. Today, BiteGo connects hungry customers with the
            best local kitchens, turning quick cravings into memorable meals.
          </p>
        </div>
        <div className="about-card">
          <p className="about-eyebrow">What we promise</p>
          <ul className="about-list">
            {values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-highlights">
        {highlights.map((item) => (
          <div className="about-highlight-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default About;
