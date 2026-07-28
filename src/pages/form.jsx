import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, FileText, User, GraduationCap, Heart, Users, DollarSign, X } from 'lucide-react';

const APPLICATION_FORM_FEE = 11500;

export default function AdmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    programme: '',
    surname: '',
    firstname: '',
    othername: '',
    dob: '',
    gender: '',
    state_of_origin: '',
    lga: '',
    marital_status: '',
    residential_address: '',
    phone_number: '',
    alternative_phone: '',
    email: '',
    whatsapp_number: '',
    qualification_route: '',
    highest_qualification: '',
    institution_name: '',
    graduation_year: '',
    experience_years: '',
    tm_background: '',
    tm_experience: '',
    motivation: '',
    nok_name: '',
    nok_relationship: '',
    nok_phone: '',
    nok_email: '',
    nok_address: '',
    payment_option: '',
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const [files, setFiles] = useState({
    passport_photo: null,
    birth_certificate_or_attestation: null,
    school_certificate: null,
    practice_documentation: null,
    medical_fitness_certificate: null,
    recommendation_letter: null,
    additional_certificates: null,
  });

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/students/application-status`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to check application status');
      }

      setHasApplied(Boolean(data.has_applied));
      setPaymentDetails(data.payment || null);
      setPaymentStatus(data.payment?.status || 'unpaid');
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const verifyPayment = async (transactionId, txRef) => {
    setVerifyingPayment(true);
    setPaymentMessage('Verifying your Flutterwave payment...');

    try {
      const response = await fetch(`${API_URL}/students/payment/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId || null,
          tx_ref: txRef,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment verification failed');
      }

      setPaymentStatus('paid');
      setPaymentMessage('Payment verified. You can now fill the form.');
      window.history.replaceState({}, document.title, window.location.pathname);
      await checkApplicationStatus();
    } catch (error) {
      setPaymentMessage(error.message || 'Payment verification failed.');
      setCheckingStatus(false);
    } finally {
      setVerifyingPayment(false);
    }
  };

  const initializePayment = async () => {
    setPaymentLoading(true);
    setPaymentMessage('');

    try {
      const response = await fetch(`${API_URL}/students/payment/initialize`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to initialize payment');
      }

      if (data.already_paid) {
        setPaymentStatus('paid');
        setPaymentMessage('Payment already confirmed. You can continue with the form.');
        await checkApplicationStatus();
        return;
      }

      if (!data.payment_link) {
        throw new Error('No payment link was returned.');
      }

      window.location.href = data.payment_link;
    } catch (error) {
      setPaymentMessage(error.message || 'Unable to start payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const txRef = params.get('tx_ref');
    const transactionId = params.get('transaction_id');

    if ((status === 'successful' || status === 'pending') && txRef) {
      verifyPayment(transactionId, txRef);
      return;
    }

    if (status === 'cancelled') {
      setPaymentMessage('Payment was cancelled. Complete payment to unlock the form.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    checkApplicationStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const removeFile = (name) => {
    setFiles(prev => ({ ...prev, [name]: null }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.programme) newErrors.programme = 'Programme selection is required';
      if (!formData.surname) newErrors.surname = 'Surname is required';
      if (!formData.firstname) newErrors.firstname = 'First name is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.state_of_origin) newErrors.state_of_origin = 'State of origin is required';
      if (!formData.lga) newErrors.lga = 'LGA is required';
      if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
    }

    if (step === 2) {
      if (!formData.residential_address) newErrors.residential_address = 'Address is required';
      if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
      if (!formData.email) newErrors.email = 'Email is required';
    }

    if (step === 3) {
      if (!formData.qualification_route) newErrors.qualification_route = 'Qualification route is required';
      if (!formData.motivation) newErrors.motivation = 'Motivation is required';
    }

    if (step === 4) {
      if (!formData.nok_name) newErrors.nok_name = 'Next of kin name is required';
      if (!formData.nok_relationship) newErrors.nok_relationship = 'Relationship is required';
      if (!formData.nok_phone) newErrors.nok_phone = 'Next of kin phone is required';
      if (!formData.nok_address) newErrors.nok_address = 'Next of kin address is required';
    }

    if (step === 5) {
      if (!formData.payment_option) newErrors.payment_option = 'Payment option is required';
      if (!files.passport_photo) newErrors.passport_photo = 'Passport photo is required';
      if (!files.birth_certificate_or_attestation) newErrors.birth_certificate_or_attestation = 'Birth certificate/attestation is required';
      if (formData.qualification_route === 'academic' && !files.school_certificate) {
        newErrors.school_certificate = 'School certificate is required for academic route';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) return;

    setLoading(true);
    
    const submitFormData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        submitFormData.append(key, formData[key]);
      }
    });
    
    Object.keys(files).forEach(key => {
      if (files[key]) {
        submitFormData.append(key, files[key]);
      }
    });

    try {
      const response = await fetch(`${API_URL}/students/apply`, {
        method: 'POST',
        body: submitFormData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessData(data);
      } else {
        setErrors({ submit: data.message || 'Submission failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Contact', icon: FileText },
    { number: 3, title: 'Education', icon: GraduationCap },
    { number: 4, title: 'Next of Kin', icon: Users },
    { number: 5, title: 'Payment & Docs', icon: DollarSign },
  ];

  if (checkingStatus || verifyingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-700 mx-auto mb-4" />
          <p className="text-sm text-gray-600">{paymentMessage || 'Checking your application access...'}</p>
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Application Submitted! 🎉</h2>
            <p className="text-gray-600">Your application has been received successfully.</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Application ID</p>
            <p className="text-2xl font-bold text-green-700">{successData.application_id}</p>
          </div>

          {successData.pioneer_discount_applied && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-6 text-center">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">🌟 Pioneer Discount Applied!</h3>
              <p className="text-yellow-700">You're among our first 20 applicants and saved ₦30,000!</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <h3 className="font-bold text-gray-800 mb-3">What's Next?</h3>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-700">1</span>
              </div>
              <p className="text-sm text-gray-600">Check your email for confirmation</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-700">2</span>
              </div>
              <p className="text-sm text-gray-600">We'll review your application within 5-7 days</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-700">3</span>
              </div>
              <p className="text-sm text-gray-600">You'll receive admission status via email</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Need help?</strong> Contact us on WhatsApp: <span className="font-mono">+234 802 298 1214</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Applied</h2>
          <p className="text-gray-600">You have already submitted your application. Check your email for confirmation.</p>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus !== 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Pay Before Filling the Form</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              The OCOAM admission form is unlocked only after payment of the application fee through Flutterwave.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white rounded-2xl p-6 my-8">
            <p className="text-sm uppercase tracking-[0.25em] text-green-100 mb-2">Admission Form Fee</p>
            <p className="text-4xl font-bold mb-2">₦{APPLICATION_FORM_FEE.toLocaleString()}</p>
            <p className="text-green-100">One-time payment required before application submission.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-green-700">1</span>
              </div>
              <p className="font-semibold text-gray-800 mb-1">Start Payment</p>
              <p className="text-sm text-gray-600">Proceed to Flutterwave to pay the form fee securely.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-green-700">2</span>
              </div>
              <p className="font-semibold text-gray-800 mb-1">Automatic Verification</p>
              <p className="text-sm text-gray-600">Once payment succeeds, we verify it and unlock the form.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-green-700">3</span>
              </div>
              <p className="font-semibold text-gray-800 mb-1">Fill the Form</p>
              <p className="text-sm text-gray-600">After verification, complete and submit your admission application.</p>
            </div>
          </div>

          {paymentDetails?.status === 'pending' && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
              A payment attempt is pending verification. If you already paid, use the button below to re-check the payment status.
            </div>
          )}

          {paymentMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              {paymentMessage}
            </div>
          )}

          <button
            type="button"
            onClick={initializePayment}
            disabled={paymentLoading}
            className="w-full rounded-xl bg-green-700 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {paymentLoading ? 'Preparing payment...' : `Pay ₦${APPLICATION_FORM_FEE.toLocaleString()} with Flutterwave`}
          </button>

          {paymentDetails?.status === 'pending' && paymentDetails?.tx_ref && (
            <button
              type="button"
              onClick={() => verifyPayment(paymentDetails.transaction_id, paymentDetails.tx_ref)}
              disabled={verifyingPayment}
              className="mt-3 w-full rounded-xl border border-green-700 px-6 py-4 text-lg font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Check Payment Status
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Oduduwa College of Yoruba Medicine</h1>
          <p className="text-center text-green-100 italic">Preserving Heritage • Advancing Knowledge • Healing Communities</p>
          <div className="mt-4 text-center">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">March 2026 Session - Apply Now</span>
          </div>
        </div>

        {/* Pioneer Banner */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-amber-400 border-4 border-amber-600 rounded-xl p-6 mb-8 text-center shadow-lg"
        >
          <h3 className="text-2xl font-bold text-amber-900 mb-1">🌟 Pioneer Cohort Discount</h3>
          <p className="text-amber-800 font-semibold">First 20 Students Save ₦30,000!</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.number}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= step.number
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2 font-medium text-gray-600 hidden md:block">{step.title}</span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-green-600" />
                  Personal Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Programme *</label>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.programme === 'professional' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="programme"
                        value="professional"
                        checked={formData.programme === 'professional'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-3 text-sm">
                        <strong>Part-time (Weekend) Track</strong>
                        <br />
                        Duration: 15 months &middot; Format: Virtual
                        <br />
                        For: Practitioners and mature people with passion
                        <br />
                        Program begins: 25/09/2026
                      </span>
                    </label>
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.programme === 'advanced' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="programme"
                        value="advanced"
                        checked={formData.programme === 'advanced'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-3 text-sm">
                        <strong>Full-time Track</strong>
                        <br />
                        Duration: 15 months full-time + 3 months internship &middot; Format: Hybrid (virtual and physical)
                        <br />
                        For: Secondary school certificate holders
                        <br />
                        Program begins: 21/09/2026
                      </span>
                    </label>
                  </div>
                  {errors.programme && <p className="text-red-500 text-xs mt-1">{errors.programme}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Surname *</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Enter surname"
                    />
                    {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Enter first name"
                    />
                    {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Other Names</label>
                    <input
                      type="text"
                      name="othername"
                      value={formData.othername}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status *</label>
                    <select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    {errors.marital_status && <p className="text-red-500 text-xs mt-1">{errors.marital_status}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State of Origin *</label>
                    <input
                      type="text"
                      name="state_of_origin"
                      value={formData.state_of_origin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="e.g., Osun"
                    />
                    {errors.state_of_origin && <p className="text-red-500 text-xs mt-1">{errors.state_of_origin}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Local Government Area *</label>
                    <input
                      type="text"
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="e.g., Ijebu-Jesa"
                    />
                    {errors.lga && <p className="text-red-500 text-xs mt-1">{errors.lga}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-green-600" />
                  Contact Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Residential Address *</label>
                  <textarea
                    name="residential_address"
                    value={formData.residential_address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter your full address"
                  />
                  {errors.residential_address && <p className="text-red-500 text-xs mt-1">{errors.residential_address}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="08012345678"
                    />
                    {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Phone</label>
                    <input
                      type="tel"
                      name="alternative_phone"
                      value={formData.alternative_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Educational Background */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                  Educational Background
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification Route *</label>
                  <div className="space-y-3">
                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.qualification_route === 'academic' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="qualification_route"
                        value="academic"
                        checked={formData.qualification_route === 'academic'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 mt-1"
                      />
                      <span className="ml-3 text-sm">
                        <strong>Academic Route:</strong> I have School Certificate (WAEC/NECO/GCE O-Level)
                      </span>
                    </label>
                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.qualification_route === 'practice' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="qualification_route"
                        value="practice"
                        checked={formData.qualification_route === 'practice'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 mt-1"
                      />
                      <span className="ml-3 text-sm">
                        <strong>Practice-Based Route:</strong> I have 10+ years professional practice in traditional medicine
                      </span>
                    </label>
                  </div>
                  {errors.qualification_route && <p className="text-red-500 text-xs mt-1">{errors.qualification_route}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Qualification</label>
                    <select
                      name="highest_qualification"
                      value={formData.highest_qualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select</option>
                      <option value="ssce">SSCE/WAEC/NECO</option>
                      <option value="ond">OND</option>
                      <option value="nce">NCE</option>
                      <option value="hnd">HND</option>
                      <option value="degree">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name</label>
                    <input
                      type="text"
                      name="institution_name"
                      value={formData.institution_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year</label>
                    <input
                      type="text"
                      name="graduation_year"
                      value={formData.graduation_year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="e.g., 2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience (if Practice-Based)</label>
                    <input
                      type="text"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="e.g., 12 years"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Traditional Medicine Background (Optional)
                  </h4>
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Do you have any background in traditional medicine?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="tm_background"
                            value="yes"
                            checked={formData.tm_background === 'yes'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="tm_background"
                            value="no"
                            checked={formData.tm_background === 'no'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    </div>

                    {formData.tm_background === 'yes' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Describe your experience</label>
                        <textarea
                          name="tm_experience"
                          value={formData.tm_experience}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="E.g., family tradition, apprenticeship, personal interest..."
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Why do you want to study traditional Yoruba medicine? *</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Share your motivation and goals..."
                  />
                  {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 4: Next of Kin */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  Next of Kin / Emergency Contact
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="nok_name"
                      value={formData.nok_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Next of kin full name"
                    />
                    {errors.nok_name && <p className="text-red-500 text-xs mt-1">{errors.nok_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship *</label>
                    <input
                      type="text"
                      name="nok_relationship"
                      value={formData.nok_relationship}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="e.g., Mother, Father, Sibling"
                    />
                    {errors.nok_relationship && <p className="text-red-500 text-xs mt-1">{errors.nok_relationship}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="nok_phone"
                      value={formData.nok_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="08012345678"
                    />
                    {errors.nok_phone && <p className="text-red-500 text-xs mt-1">{errors.nok_phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="nok_email"
                      value={formData.nok_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                  <textarea
                    name="nok_address"
                    value={formData.nok_address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Next of kin full address"
                  />
                  {errors.nok_address && <p className="text-red-500 text-xs mt-1">{errors.nok_address}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 5: Payment & Documents */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Payment Option & Documents
                </h2>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-green-900 mb-4">Programme Fee Structure</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Regular Fee:</span>
                      <span className="line-through text-gray-500">₦280,000</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-green-700">
                      <span>Pioneer Discount:</span>
                      <span>₦250,000</span>
                    </div>
                    <p className="text-xs text-green-800 bg-green-100 p-2 rounded">You save ₦30,000 as a pioneer student!</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Option *</label>
                  <div className="space-y-3">
                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.payment_option === 'full' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="payment_option"
                        value="full"
                        checked={formData.payment_option === 'full'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-bold text-sm">Option A: Full Payment (₦240,000)</div>
                        <div className="text-xs text-gray-600 mt-1">Pay in full and get additional ₦10,000 discount!</div>
                      </div>
                    </label>

                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.payment_option === 'three' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="payment_option"
                        value="three"
                        checked={formData.payment_option === 'three'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-bold text-sm">Option B: Three Installments</div>
                        <div className="text-xs text-gray-600 mt-1">₦90,000 + ₦80,000 + ₦80,000</div>
                      </div>
                    </label>

                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${formData.payment_option === 'four' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="payment_option"
                        value="four"
                        checked={formData.payment_option === 'four'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-bold text-sm">Option C: Four Installments</div>
                        <div className="text-xs text-gray-600 mt-1">₦70,000 + ₦60,000 + ₦60,000 + ₦60,000</div>
                      </div>
                    </label>
                  </div>
                  {errors.payment_option && <p className="text-red-500 text-xs mt-1">{errors.payment_option}</p>}
                </div>

                <div className="border-t-2 pt-6">
                  <h3 className="font-bold text-gray-800 mb-4">Upload Required Documents</h3>
                  
                  <div className="space-y-4">
                    <FileUploadField
                      label="Passport Photo *"
                      name="passport_photo"
                      file={files.passport_photo}
                      error={errors.passport_photo}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />

                    <FileUploadField
                      label="Birth Certificate / Attestation *"
                      name="birth_certificate_or_attestation"
                      file={files.birth_certificate_or_attestation}
                      error={errors.birth_certificate_or_attestation}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />

                    {formData.qualification_route === 'academic' && (
                      <FileUploadField
                        label="School Certificate (WAEC/NECO) *"
                        name="school_certificate"
                        file={files.school_certificate}
                        error={errors.school_certificate}
                        onChange={handleFileChange}
                        onRemove={removeFile}
                      />
                    )}

                    <FileUploadField
                      label="Practice Documentation (Optional)"
                      name="practice_documentation"
                      file={files.practice_documentation}
                      error={errors.practice_documentation}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />

                    <FileUploadField
                      label="Medical Fitness Certificate (Optional)"
                      name="medical_fitness_certificate"
                      file={files.medical_fitness_certificate}
                      error={errors.medical_fitness_certificate}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />

                    <FileUploadField
                      label="Recommendation Letter (Optional)"
                      name="recommendation_letter"
                      file={files.recommendation_letter}
                      error={errors.recommendation_letter}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />

                    <FileUploadField
                      label="Additional Certificates (Optional)"
                      name="additional_certificates"
                      file={files.additional_certificates}
                      error={errors.additional_certificates}
                      onChange={handleFileChange}
                      onRemove={removeFile}
                    />
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-2">
            {currentStep > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Previous
              </motion.button>
            )}
            
            {currentStep < 5 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
              >
                Next Step
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

function FileUploadField({ label, name, file, error, onChange, onRemove }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(name)}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Click to upload</span>
          <input
            type="file"
            name={name}
            onChange={onChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
        </label>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
