/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabView, Language, Dish, ConfirmedBooking } from './types';
import { DISHES } from './data/restaurantData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DishModal } from './components/DishModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { Toast } from './components/Toast';

import { HomeView } from './views/HomeView';
import { MenuView } from './views/MenuView';
import { BookTableView } from './views/BookTableView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabView>('home');
  const [language, setLanguage] = useState<Language>('EN');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initial confirmed reservation reflecting the Astrid Lindqvist pass from the design
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([
    {
      id: '#TR-88421',
      guests: 2,
      date: 'Today, Sun 20 Sep',
      time: '18:30',
      seatingArea: 'Main Dining Room (Matsal)',
      fullName: 'Astrid Lindqvist',
      countryCode: '+46',
      phone: '070 123 45 67',
      email: 'astrid.lindqvist@example.se',
      specialRequests: 'Quiet corner requested for anniversary dinner. 1 pescatarian guest.',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [savedDishes, setSavedDishes] = useState<Dish[]>([DISHES[0]]);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

  const handleTabChange = (tab: TabView) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDishById = (dishId: string) => {
    const found = DISHES.find((d) => d.id === dishId);
    if (found) {
      setSelectedDish(found);
    }
  };

  const handleAddToTastingNotes = (dish: Dish) => {
    if (!savedDishes.some((d) => d.id === dish.id)) {
      setSavedDishes((prev) => [...prev, dish]);
      showToast(
        language === 'SV'
          ? `Lade till "${dish.titleSv}" i dina provsmakningsnoteringar`
          : `Saved "${dish.title}" to your tasting wishlist`
      );
    } else {
      showToast(
        language === 'SV'
          ? `"${dish.titleSv}" finns redan i din lista`
          : `"${dish.title}" is already in your wishlist`
      );
    }
    setSelectedDish(null);
  };

  const handleRemoveSavedDish = (dishId: string) => {
    setSavedDishes((prev) => prev.filter((d) => d.id !== dishId));
    showToast(
      language === 'SV' ? 'Borttagen från provsmakningslistan' : 'Removed from wishlist'
    );
  };

  const handleNewBooking = (booking: ConfirmedBooking) => {
    setConfirmedBookings((prev) => [booking, ...prev]);
  };

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf9f7] text-[#1b1c1b] flex flex-col selection:bg-[#fedeb2] selection:text-[#281800]">
      {/* Fixed App Header */}
      <Header
        currentTab={currentTab}
        language={language}
        onLanguageChange={setLanguage}
        onOpenProfile={() => setIsProfileOpen(true)}
        savedNotesCount={savedDishes.length}
      />

      {/* Main Screen Container */}
      <main className="flex-1 w-full max-w-lg mx-auto pt-20 pb-20 px-4">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleTabChange}
            language={language}
            onOpenDishModal={handleOpenDishById}
          />
        )}

        {currentTab === 'menu' && (
          <MenuView
            language={language}
            onSelectDish={setSelectedDish}
            onNavigate={handleTabChange}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'book-table' && (
          <BookTableView
            language={language}
            onBookingConfirmed={handleNewBooking}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onNavigate={handleTabChange}
            language={language}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView
            language={language}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Ergonomic Dock */}
      <Navigation
        currentTab={currentTab}
        onTabChange={handleTabChange}
        language={language}
      />

      {/* Course Detail Modal Sheet */}
      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        language={language}
        onAddToTastingNotes={handleAddToTastingNotes}
        isSaved={selectedDish ? savedDishes.some((d) => d.id === selectedDish.id) : false}
      />

      {/* Guest Profile & Booking Pass Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
        confirmedBookings={confirmedBookings}
        savedDishes={savedDishes}
        onRemoveDish={handleRemoveSavedDish}
        onNavigateToBooking={() => handleTabChange('book-table')}
      />

      {/* Transient Notification Toast */}
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}
