import React, { useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { useUserProfile } from "./useUserProfile";
import { useUserBalance } from "./useUserBalance";
import { useUserAccounts } from "./useUserAccounts";
import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { useScroll } from "../../context/ScrollContext";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { MenuIcon } from "../../components/icons/MenuIcon/MenuIcon";
import { TransferIcon } from "../../components/icons/TransferIcon";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVisible, direction, hasScrolled, scrollY } = useScroll();
  const { data: userDetails, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useUserBalance();
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useUserAccounts();

  // Debug scroll position
  useEffect(() => {
    const updateScrollPosition = () => {
      const scrollDebug = document.getElementById('scroll-debug');
      if (scrollDebug) {
        scrollDebug.textContent = window.scrollY.toString();
      }
    };

    // Test basic scroll event capture
    const testScroll = () => {
      console.log('🎯 BASIC SCROLL EVENT CAPTURED!', window.scrollY);
    };

    // Test document scroll events
    const testDocumentScroll = () => {
      console.log('📜 DOCUMENT SCROLL EVENT!', window.scrollY);
    };

    window.addEventListener('scroll', updateScrollPosition);
    window.addEventListener('scroll', testScroll);
    document.addEventListener('scroll', testDocumentScroll);
    updateScrollPosition(); // Initial call
    
    console.log('🔍 Scroll event listeners added to HomePage');
    console.log('📏 Page dimensions:', {
      windowHeight: window.innerHeight,
      documentHeight: document.body.scrollHeight,
      isScrollable: document.body.scrollHeight > window.innerHeight,
      currentScrollY: window.scrollY
    });

    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
      window.removeEventListener('scroll', testScroll);
      document.removeEventListener('scroll', testDocumentScroll);
    };
  }, []);
  
  if (!user) {
    return null;
  }

  const handleTransferClick = () => {
    navigate("/money");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };


  if (profileLoading) {
    return <div className={styles.loading}>Loading user details...</div>;
  }

  if (profileError) {
    return <ErrorMessage message={`Error loading profile: ${profileError}`} />;
  }

  if (!userDetails) {
    return null;
  }

  return (
    <div className={styles.homePage}>
      {/* Scroll position debug display */}
      <div style={{ 
        position: 'fixed', 
        top: '70px', 
        right: '20px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        zIndex: 999,
        fontFamily: 'monospace'
      }}>
        Scroll Y: <span id="scroll-debug">0</span>
        <br />
        <button 
          onClick={() => {
            console.log('🧪 Manual scroll test clicked');
            window.scrollTo(0, 500);
            setTimeout(() => window.scrollTo(0, 0), 1000);
          }}
          style={{ 
            marginTop: '5px', 
            padding: '5px', 
            background: '#00ff00', 
            color: 'black', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Test Scroll
        </button>
        <br />
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <div>Context isVisible: {isVisible ? '✅' : '❌'}</div>
          <div>Context direction: {direction}</div>
          <div>Context hasScrolled: {hasScrolled ? '✅' : '❌'}</div>
          <div>Context scrollY: {scrollY}</div>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.userGreeting}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {getInitials(userDetails.username)}
            </div>
            <div className={styles.greeting}>
              Hello, {userDetails.username}
            </div>
          </div>
          <MenuIcon />
        </div>

        <div className={styles.balanceSection}>
          <div className={styles.balanceLabel}>Total Balance</div>
          <div className={styles.balanceAmount}>
            {balanceLoading ? 
              "Loading..." : 
              balanceError ? 
                "Error" : 
                formatCurrency(balance || 0)
            }
          </div>
          <div className={styles.lastUpdated}>
            Balance last updated at {formatTime()} ↻
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleTransferClick}>
            <TransferIcon />
            Transfer
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.accountsSection}>
          <h3 className={styles.sectionTitle}>My Accounts</h3>
          
          {accountsLoading ? (
            <div className={styles.accountsLoading}>Loading accounts...</div>
          ) : accountsError ? (
            <ErrorMessage message={`Error loading accounts: ${accountsError}`} />
          ) : accounts && accounts.length > 0 ? (
            <div className={styles.accountsList}>
              {accounts.map((account) => (
                <div key={account.id} className={styles.accountCard}>
                  <div className={styles.accountHeader}>
                    <span className={styles.accountName}>{account.name}</span>
                    {account.isDefault && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  <div className={styles.accountDetails}>
                    <span className={styles.accountType}>{account.accountType}</span>
                    <span className={styles.accountDate}>
                      Created {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              <button 
                className={styles.addAccountButton}
                onClick={() => navigate('/accounts')}
              >
                View All Accounts
              </button>
            </div>
          ) : (
            <div className={styles.noAccounts}>
              <p>No accounts found</p>
              <button 
                className={styles.createAccountButton}
                onClick={() => navigate('/accounts/create')}
              >
                Create Your First Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Force scrolling with a very tall element */}
      <div style={{ 
        height: '3000px', 
        background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)', 
        margin: '20px', 
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          padding: '40px', 
          color: 'white', 
          textAlign: 'center',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '20px'
        }}>
          <h2>SCROLL TEST AREA</h2>
          <p>This element is 3000px tall to force scrolling.</p>
          <p>Scroll down to see the navbar hide!</p>
          <p>Scroll up to see the navbar appear!</p>
        </div>
      </div>

      <BottomNavigation selected="Home" />
    </div>
  );
};
