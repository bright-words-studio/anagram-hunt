import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, Image, Animated, Dimensions } from 'react-native';
import { Language } from '../types';
import { getDeviceLanguage } from '../utils/language';
import { t } from '../utils/translations';
import StreakIcon from '../components/StreakIcon';
import StraightIcon from '../components/StraightIcon';

interface SplashScreenProps {
  onStartGame: (language: Language) => void;
  onResumeGame?: () => void;
  hasSavedGame?: boolean;
}

const SplashScreen = ({ onStartGame, onResumeGame, hasSavedGame = false }: SplashScreenProps) => {
  const [language, setLanguage] = useState<Language>('en');
  const [showMain, setShowMain] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const companyFade = useRef(new Animated.Value(1)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(0)).current;
  const logoHeight = useRef(new Animated.Value(250)).current;
  const logoMarginBottom = useRef(new Animated.Value(-60)).current;
  const [showContent, setShowContent] = useState(false);
  const contentFade = useRef(new Animated.Value(0)).current;

  const finalLogoMargin = 20; // same as styles.logoImage.height
  const viewportHeight = window.innerHeight; 
  const finalLogoHeight = Math.min(250, (viewportHeight - 500)); // same as styles.logoImage.height
  const contentHeight = 340; // estimated height of the splash content box
  
  // Calculate initial position to center the logo on screen
  const initialLogoPosition = (contentHeight / 2);
  const finalLogoPosition = 0;
  
  // Set initial position only once
  if (!animationCompleted) {
    logoTranslate.setValue(initialLogoPosition);
  }

  useEffect(() => {
    setLanguage(getDeviceLanguage());
    // Sequence: company logo fade out, game logo fade in, then move up and resize, then show content
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(companyFade, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(logoFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(logoTranslate, { toValue: finalLogoPosition, duration: 600, useNativeDriver: true }),
        Animated.timing(logoHeight, { toValue: finalLogoHeight, duration: 600, useNativeDriver: false }),
        Animated.timing(logoMarginBottom, { toValue: finalLogoMargin, duration: 600, useNativeDriver: false }),
        Animated.timing(contentFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setAnimationCompleted(true);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Company logo and Presents text */}
      {!showMain && (
        <Animated.View style={[styles.centered, { opacity: companyFade, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center' }]} pointerEvents="none"> 
          <Image source={require('../../assets/company-logo.png')} style={styles.companyLogoSplash} resizeMode="contain" />
          <Text style={styles.presentsText}>{t('splash.presents', language)}</Text>
        </Animated.View>
      )}
      {/* Game logo and animated transition */}
      <View style={styles.content}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[
            styles.logoImage,
            {
              opacity: logoFade,
              height: logoHeight,
              marginBottom: logoMarginBottom,
              transform: [
                { translateY: logoTranslate }
              ],
            },
          ]}
          resizeMode="contain"
        />
        <Animated.View style={{ opacity: contentFade, width: '100%' }}>
          <Text style={styles.subtitle}>{t('splash.welcome', language)}</Text>

          <View style={styles.rule}>
            <Text style={styles.ruleNumber}>1.</Text>
            <Text style={styles.ruleText}>{t('splash.rule1', language)}</Text>
          </View>
          <View style={styles.rule}>
            <Text style={styles.ruleNumber}>2.</Text>
            <Text style={styles.ruleText}>{t('splash.rule2', language)}</Text>
          </View>
          <View style={styles.rule}>
            <Text style={styles.ruleNumber}>3.</Text>
            <Text style={styles.ruleText}>{t('splash.rule3', language)}</Text>
          </View>

          <View style={styles.languageSelector}>
            <Text style={[styles.langText, language === 'en' && styles.activeLang]}>English</Text>
            <Switch
              value={language === 'de'}
              onValueChange={(isGerman) => setLanguage(isGerman ? 'de' : 'en')}
              trackColor={{ false: '#81b0ff', true: '#f5dd4b' }}
              thumbColor={"#f4f3f4"}
            />
            <Text style={[styles.langText, language === 'de' && styles.activeLang]}>Deutsch</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={() => onStartGame(language)}>
            <Text style={styles.startButtonText}>{t('splash.startGame', language)}</Text>
          </TouchableOpacity>
          
          {hasSavedGame && onResumeGame && (
            <TouchableOpacity style={styles.resumeButton} onPress={onResumeGame}>
              <Text style={styles.resumeButtonText}>{t('splash.resumeGame', language)}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '92%',
    maxHeight: '96.3%',
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ruleNumber: {
    fontSize: 18,
    color: '#FFD700',
    marginRight: 10,
  },
  ruleText: {
    fontSize: 16,
    color: '#ddd',
    flex: 1,
    lineHeight: 24,
  },
  inlineIcon: {
    width: 18,
    height: 18,
  },
  bonusIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  langText: {
    fontSize: 18,
    color: '#888',
    marginHorizontal: 15,
  },
  activeLang: {
    color: '#fff',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 250,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  companyLogoSplash: {
    width: 720,
    height: 320,
    marginBottom: 16,
  },
  presentsText: {
    fontSize: 22,
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 250,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreen; 