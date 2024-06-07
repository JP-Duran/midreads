import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/';
import { BrowserRouter } from 'react-router-dom';
import Profile from './profile';
import AuthProvider from '../Auth';
import { auth } from '../firebase';

// Mock the onAuthStateChanged method
jest.mock('../firebase', () => {
  const originalModule = jest.requireActual('../firebase');
  return {
    ...originalModule,
    auth: {
      onAuthStateChanged: jest.fn()
    }
  };
});

const mockCurrentUser = {
  email: 'test@example.com',
  uid: '123',
  photoURL: 'https://example.com/photo.jpg'
};

const renderWithProviders = (ui, { providerProps = {}, ...renderOptions } = {}) => {
  return render(
    <AuthProvider value={{ currentUser: mockCurrentUser, ...providerProps }}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>,
    renderOptions
  );
};

// Simulate the onAuthStateChanged call
beforeEach(() => {
  auth.onAuthStateChanged.mockImplementation((callback) => {
    act(() => {
      callback(mockCurrentUser);
    });
  });
});

test('renders user details', async () => {
  await act(async () => {
    renderWithProviders(<Profile />);
  });
  expect(await screen.findByText(/User: test@example.com/i)).toBeInTheDocument();
});

test('allows user to edit bio', async () => {
  await act(async () => {
    renderWithProviders(<Profile />);
  });
  fireEvent.click(await screen.findByText(/Edit/i));
  const bioInput = screen.getByPlaceholderText(/Enter your bio here/i);
  fireEvent.change(bioInput, { target: { value: 'New bio' } });
  expect(bioInput.value).toBe('New bio');
});

test('displays the user avatar', async () => {
  await act(async () => {
    renderWithProviders(<Profile />);
  });
  const avatar = screen.getByAltText('Avatar');
  expect(avatar).toBeInTheDocument();
  expect(avatar.src).toBe('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png');
});
