import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, CreditCard, QrCode, Smartphone, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PlanOption {
  id: string;
  name: string;
  price: number;
  quality: string;
  resolution: string;
  devices: number;
}

const SubscriptionPayment = () => {
  const plans: PlanOption[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 8.99,
      quality: 'Good',
      resolution: '720p',
      devices: 1
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 14.99,
      quality: 'Better',
      resolution: '1080p',
      devices: 2
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      quality: 'Best',
      resolution: '4K+HDR',
      devices: 4
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.substring(0, 19)); // Limit to 16 digits (plus 3 spaces)
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpiry(value);
    } else if (value.length <= 4) {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2)}`);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast.error('Please fill in all payment details');
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast.success(`Successfully subscribed to ${plans.find(p => p.id === selectedPlan)?.name} plan!`);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Enjoy full access to PLEXSTREAM on all your devices. You can change or cancel your plan anytime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`overflow-hidden transition-all ${
                selectedPlan === plan.id 
                  ? 'border-primary border-2 shadow-lg shadow-primary/20' 
                  : 'hover:border-primary/50'
              }`}
            >
              <div className={`h-2 ${selectedPlan === plan.id ? 'bg-primary' : 'bg-secondary'}`} />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{plan.quality} video quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{plan.resolution} resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Watch on {plan.devices} device{plan.devices > 1 ? 's' : ''}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                
                <Button
                  variant={selectedPlan === plan.id ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="max-w-xl mx-auto bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="text-primary" />
            <span>Payment Details</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="cardName" className="text-sm font-medium">Name on Card</label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Smith"
                className="w-full p-3 border rounded-md bg-background"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cardNumber" className="text-sm font-medium">Card Number</label>
              <div className="relative">
                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="expiry" className="text-sm font-medium">Expiry Date</label>
                <input
                  id="expiry"
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full p-3 border rounded-md bg-background"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cvv" className="text-sm font-medium">CVV</label>
                <input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full p-3 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full py-6 text-lg" disabled={processing}>
                {processing ? 'Processing...' : `Subscribe for $${plans.find(p => p.id === selectedPlan)?.price}/month`}
              </Button>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically renew monthly until canceled.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
