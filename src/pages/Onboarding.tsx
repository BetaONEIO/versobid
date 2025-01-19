import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

interface OnboardingStep {
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to VersoBid!',
    description: 'Let\'s get you set up to start buying and selling.'
  },
  {
    title: 'Your Address',
    description: 'We need your address for shipping and billing purposes.'
  },
  {
    title: 'Payment Setup',
    description: 'Link your PayPal account to start making secure transactions.'
  }
];

interface AddressFormData {
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useUser();
  const { addNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState<AddressFormData>({
    street: '',
    city: '',
    postcode: '',
    country: ''
  });
  const [paypalLinked, setPaypalLinked] = useState(false);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          shipping_address: address
        })
        .eq('id', auth.user?.id);

      if (error) throw error;
      
      addNotification('success', 'Address saved successfully');
      setCurrentStep(2);
    } catch (error) {
      addNotification('error', 'Failed to save address');
    }
  };

  const handlePayPalApproval = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          payment_setup: true,
          onboarding_completed: true
        })
        .eq('id', auth.user?.id);

      if (error) throw error;

      setPaypalLinked(true);
      addNotification('success', 'PayPal account linked successfully');
      navigate('/');
    } catch (error) {
      addNotification('error', 'Failed to link PayPal account');
    }
  };

  const renderStep = (stepIndex: number) => {
    const currentStepData = steps[stepIndex];
    
    switch (stepIndex) {
      case 0:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{currentStepData.description}</p>
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{currentStepData.description}</p>
            
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Postcode</label>
                <input
                  type="text"
                  required
                  value={address.postcode}
                  onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a country</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Address
              </button>
            </form>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{currentStepData.description}</p>
            
            {!paypalLinked && (
              <div className="max-w-sm mx-auto">
                <PayPalButtons
                  createOrder={(_, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        amount: {
                          value: "0.01",
                          currency_code: "GBP"
                        },
                        description: "VersoBid Account Verification"
                      }]
                    });
                  }}
                  onApprove={async (_, actions) => {
                    if (actions.order) {
                      await actions.order.capture();
                      handlePayPalApproval();
                    }
                  }}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  We'll charge a small amount (£0.01) to verify your PayPal account.
                  This will be refunded immediately.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map(({ title }, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                  title={title}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="absolute h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          {renderStep(currentStep)}
        </div>
      </div>
    </div>
  );
};