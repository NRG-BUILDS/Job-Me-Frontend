import React, { useState } from "react";
import { ChevronRight, Play, Info, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CreateSkillsForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceTitle: "",
    category: "",
    subcategory: "",
    searchTags: "",
    offerings: [],
    description: "",
    faq: [],
    gallery: [],
    requirements: {
      ninSlip: null,
      proofOfMembership: null,
      utilityBill: null,
      email: "",
    },
  });

  const steps = [
    { num: 1, label: "Overview", active: true },
    { num: 2, label: "Offerings", active: false },
    { num: 3, label: "Description & FAQ", active: false },
    { num: 4, label: "Gallery", active: false },
    { num: 5, label: "Requirements", active: false },
    { num: 6, label: "Publish", active: false },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }));
  };

  const addOffering = () => {
    if (formData.offerings.length < 5) {
      setFormData((prev) => ({
        ...prev,
        offerings: [...prev.offerings, { title: "", price: "" }],
      }));
    }
  };

  const updateOffering = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      offerings: prev.offerings.map((offering, i) =>
        i === index ? { ...offering, [field]: value } : offering,
      ),
    }));
  };

  const removeOffering = (index) => {
    setFormData((prev) => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    if (formData.faq.length < 5) {
      setFormData((prev) => ({
        ...prev,
        faq: [...prev.faq, { question: "", answer: "" }],
      }));
    }
  };

  const updateFaq = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.map((faqItem, i) =>
        i === index ? { ...faqItem, [field]: value } : faqItem,
      ),
    }));
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      handleRequirementChange(field, file);
    }
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...files],
    }));
  };

  const removeGalleryItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Steps */}
      {currentStep < 7 && (
        <div className="border-b border-gray-200 bg-white px-8 py-4">
          {/* Progress Steps */}
          <div className="flex items-center space-x-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => goToStep(step.num)}
                  className={`flex items-center space-x-2 rounded-lg transition-colors ${
                    currentStep === step.num
                      ? "font-bold text-heading"
                      : currentStep > step.num
                        ? "font-medium text-muted-foreground/50"
                        : "cursor-not-allowed font-medium text-muted-foreground"
                  }`}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full font-semibold ${
                      currentStep === step.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="text-sm">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="mx-auto grid max-w-6xl gap-4 py-10 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <div className="min-h-[500px] bg-white shadow">
            {/* Form Content */}
            <div className="overflow-y-auto p-8">
              <div className="">
                {/* Step 1: Overview */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Service title
                        </label>
                        <p className="mb-3 text-sm">
                          As your service storefront, your title is the most
                          important place to include keywords that buyers would
                          likely use to search for a service like yours.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <Textarea
                          value={formData.serviceTitle}
                          onChange={(e) =>
                            handleInputChange("serviceTitle", e.target.value)
                          }
                          placeholder="I will do something I'm really good at"
                          className="w-full resize-none"
                          rows={3}
                          maxLength={80}
                        />
                        <p className="mt-1 text-right text-xs text-gray-400">
                          {formData.serviceTitle.length} / 80 max
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Category
                        </label>
                        <p className="mb-3 text-sm">
                          Choose the category and sub-category most suitable for
                          the service you render.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              handleInputChange("category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="SELECT A CATEGORY" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="graphics">
                                Graphics & Design
                              </SelectItem>
                              <SelectItem value="digital">
                                Digital Marketing
                              </SelectItem>
                              <SelectItem value="writing">
                                Writing & Translation
                              </SelectItem>
                              <SelectItem value="video">
                                Video & Animation
                              </SelectItem>
                              <SelectItem value="music">
                                Music & Audio
                              </SelectItem>
                              <SelectItem value="programming">
                                Programming & Tech
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={formData.subcategory}
                            onValueChange={(value) =>
                              handleInputChange("subcategory", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="SELECT A SUBCATEGORY" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sub1">
                                Subcategory 1
                              </SelectItem>
                              <SelectItem value="sub2">
                                Subcategory 2
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Search tags
                        </label>
                        <p className="mb-3 text-sm">
                          Tag your Gig with buzz words that are relevant to the
                          services you offer. Use all 5 tags to get found.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Positive keywords
                        </label>
                        <p className="mb-3 text-sm">
                          Enter search terms you feel your buyers will use when
                          looking for your service.
                        </p>
                        <Input
                          type="text"
                          className="w-full"
                          placeholder="Enter keywords..."
                          value={formData.searchTags}
                          onChange={(e) =>
                            handleInputChange("searchTags", e.target.value)
                          }
                        />
                        <p className="mt-1 text-xs text-gray-400">
                          5 tags maximum. Use letters and numbers only.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="lg:col-span-3"></div>

                      <div className="flex items-center space-x-2 lg:col-span-5">
                        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-orange-400">
                            Please note:
                          </span>{" "}
                          Some categories require that artisans verify their
                          skills.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Offerings */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Offerings
                        </label>
                        <p className="mb-3 text-sm">
                          List the specific jobs or tasks you provide under your
                          main service. Offerings help customers see exactly
                          what you can do.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <div className="space-y-4">
                          {formData.offerings.map((offering, i) => (
                            <div key={i} className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-1">
                                <Input
                                  type="text"
                                  className="w-full"
                                  placeholder="Offering"
                                  value={offering.title}
                                  onChange={(e) =>
                                    updateOffering(i, "title", e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="text"
                                  className="w-full"
                                  placeholder="STARTING PRICE"
                                  value={offering.price}
                                  onChange={(e) =>
                                    updateOffering(i, "price", e.target.value)
                                  }
                                />
                                <button
                                  className="text-destructive"
                                  onClick={() => removeOffering(i)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addOffering}
                            disabled={formData.offerings.length >= 5}
                          >
                            Add Offering ({5 - formData.offerings.length}{" "}
                            remaining)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Description & FAQ */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Description
                        </label>
                        <p className="mb-3 text-sm">
                          Describe your service in detail. Let customers know
                          what you offer, how you work, and why they should
                          choose you. Be clear, professional, and highlight any
                          specialties.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <Textarea
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          placeholder="Describe your service..."
                          className="w-full resize-none"
                          rows={10}
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Frequently Asked Questions (FAQs)
                        </label>
                        <p className="mb-3 text-sm">
                          Provide answers to some questions people usually ask
                          about your service.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <div className="space-y-4">
                          {formData.faq.map((faqItem, i) => (
                            <div
                              key={i}
                              className="grid gap-2 rounded border bg-muted/10 p-2 px-1.5"
                            >
                              <div className="flex items-center">
                                <Input
                                  type="text"
                                  className="w-full"
                                  placeholder="Question"
                                  value={faqItem.question}
                                  onChange={(e) =>
                                    updateFaq(i, "question", e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex items-center">
                                <Input
                                  type="text"
                                  className="w-full"
                                  placeholder="Answer"
                                  value={faqItem.answer}
                                  onChange={(e) =>
                                    updateFaq(i, "answer", e.target.value)
                                  }
                                />
                              </div>
                              <button
                                className="text-left text-destructive"
                                onClick={() => removeFaq(i)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addFaq}
                            disabled={formData.faq.length >= 5}
                          >
                            Add FAQ ({5 - formData.faq.length} remaining)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Gallery */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Gallery
                        </label>
                        <p className="mb-3 text-sm">
                          Showcase your work with images and videos.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <input
                          type="file"
                          id="gallery-upload"
                          className="hidden"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleGalleryUpload}
                        />
                        <label
                          htmlFor="gallery-upload"
                          className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Upload className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">
                                Drop files here or click to upload
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </label>
                        {formData.gallery.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {formData.gallery.map((file, i) => (
                              <div key={i} className="group relative">
                                <div className="aspect-square rounded-lg bg-gray-100 p-2">
                                  <p className="truncate text-xs">
                                    {file.name}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeGalleryItem(i)}
                                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Requirements */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Requirements
                        </label>
                        <p className="mb-3 text-sm">
                          We need to collect some data to verify your identity
                          before we can publish your service. Please provide the
                          following information about you.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <div className="space-y-4">
                          {[
                            {
                              label: "NIN Slip / Voter's Card",
                              field: "ninSlip",
                            },
                            {
                              label: "Proof of association membership",
                              field: "proofOfMembership",
                            },
                            {
                              label: "Utility bill showing current address",
                              field: "utilityBill",
                            },
                          ].map((doc, i) => (
                            <div key={i} className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  id={doc.field}
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileChange(doc.field, e)
                                  }
                                />
                                <label
                                  htmlFor={doc.field}
                                  className="flex-1 cursor-pointer"
                                >
                                  <Input
                                    type="text"
                                    className="w-full cursor-pointer"
                                    placeholder="NO FILE CHOSEN"
                                    value={
                                      formData.requirements[doc.field]?.name ||
                                      ""
                                    }
                                    readOnly
                                  />
                                </label>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold leading-5">
                                  {doc.label}
                                </span>
                              </div>
                            </div>
                          ))}

                          <div className="col-span-full mt-6 grid gap-2">
                            <Input
                              type="email"
                              className="w-full"
                              placeholder="EMAIL"
                              value={formData.requirements.email}
                              onChange={(e) =>
                                handleRequirementChange("email", e.target.value)
                              }
                            />
                            <p className="mb-3 text-sm">
                              We might send a video call invite to your email
                              before approving your service. Please provide a
                              valid email address we can contact.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Publish */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-8">
                      <div className="space-y-2 lg:col-span-3">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Review & Publish
                        </label>
                        <p className="mb-3 text-sm">
                          Review your service details before publishing. Make
                          sure everything is correct.
                        </p>
                      </div>
                      <div className="lg:col-span-5">
                        <div className="space-y-4">
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                              Service Overview
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Title:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.serviceTitle || "Not set"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Category:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.category || "Not set"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Subcategory:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.subcategory || "Not set"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Search Tags:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.searchTags || "Not set"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                              Offerings
                            </h3>
                            <div className="space-y-2 text-sm">
                              {formData.offerings.length > 0 ? (
                                formData.offerings.map((offering, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between border-b pb-2 last:border-b-0"
                                  >
                                    <span className="text-gray-700">
                                      {offering.title || "Untitled"}
                                    </span>
                                    <span className="font-semibold text-gray-600">
                                      {offering.price || "N/A"}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500">
                                  No offerings added
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                              Description
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formData.description ||
                                "No description provided"}
                            </p>
                          </div>

                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                              FAQs
                            </h3>
                            <div className="space-y-3 text-sm">
                              {formData.faq.length > 0 ? (
                                formData.faq.map((faqItem, i) => (
                                  <div
                                    key={i}
                                    className="border-b pb-2 last:border-b-0"
                                  >
                                    <p className="font-semibold text-gray-700">
                                      Q: {faqItem.question || "No question"}
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                      A: {faqItem.answer || "No answer"}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500">No FAQs added</p>
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                              Gallery
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formData.gallery.length > 0
                                ? `${formData.gallery.length} file(s) uploaded`
                                : "No files uploaded"}
                            </p>
                          </div>

                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                              Verification Documents
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  NIN/Voter's Card:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.requirements.ninSlip?.name ||
                                    "Not uploaded"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Membership Proof:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.requirements.proofOfMembership
                                    ?.name || "Not uploaded"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Utility Bill:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.requirements.utilityBill?.name ||
                                    "Not uploaded"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-700">
                                  Contact Email:
                                </span>
                                <span className="col-span-2 text-gray-600">
                                  {formData.requirements.email ||
                                    "Not provided"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-colors hover:bg-green-600"
                            onClick={() => {
                              setCurrentStep(7);
                            }}
                          >
                            Publish Service
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Pending Review */}
                {currentStep === 7 && (
                  <div className="size-full flex-col justify-center text-center">
                    <div className="mx-auto w-fit">
                      <svg
                        width="336"
                        height="336"
                        viewBox="0 0 336 336"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="336" height="336" fill="white" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M152.075 129.112C151.355 128.105 149.542 127.149 147.954 127.227C146.367 127.306 144.872 127.962 143.448 128.66C144.536 129.453 145.759 130.063 147.051 130.456C147.459 130.581 148.384 130.947 150.379 130.123"
                          fill="#E7EAEE"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M40.9274 238.592C5.34058e-05 183.062 109.636 168.127 174.761 125.497C210.249 102.268 226.48 76.8559 257.152 77.546C319.857 78.9567 322.422 197.403 309.107 218.681C258.897 298.914 57.8675 261.576 40.9274 238.592Z"
                          fill="#FFB33E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M170.688 163.381C184.365 163.381 198.281 164.674 210.556 170.808C212.003 171.531 213.672 172.875 213.15 174.423C212.954 175.004 212.476 175.434 212 175.814C206.438 180.258 199.045 181.387 192.007 182.185C189.273 182.495 186.535 182.779 183.793 183.008C162.033 184.831 139.998 183.231 118.716 178.284C117.463 177.993 116.004 177.497 115.656 176.242C115.233 174.717 116.763 173.414 118.117 172.624C128.601 166.513 140.581 163.065 152.667 162.682C150.517 163.017 181.279 163.46 170.688 163.381Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M249.158 119.964C246.335 125.647 243.975 131.669 243.325 137.99C243.297 138.262 243.275 138.553 243.402 138.795C243.657 139.286 244.333 139.31 244.881 139.274C257.592 138.437 270.729 140.938 281.513 147.768C285.199 150.102 288.584 152.915 292.407 155.015C292.576 155.107 292.768 155.201 292.952 155.147C293.138 155.093 293.25 154.908 293.344 154.737C295.667 150.514 297.724 146.143 299.5 141.658C300.13 140.069 300.73 138.441 300.886 136.736C301.279 132.446 298.456 128.067 294.405 126.684C284.023 123.14 273.641 119.595 263.258 116.051C261.361 115.403 259.437 114.75 257.439 114.605C255.44 114.461 253.324 114.879 251.783 116.169C250.597 117.162 249.848 118.575 249.158 119.964Z"
                          fill="white"
                        />
                        <path
                          d="M210.99 254.889C210.97 255.96 213.537 256.755 214.322 256.024C215.106 255.293 215.199 254.105 215.241 253.034C215.8 238.614 215.911 224.632 215.614 210.204L253.506 220.009L251.813 258.317C251.761 259.402 253.443 259.806 254.263 259.091C255.083 258.375 255.217 257.174 255.293 256.09C256.074 244.931 256.212 233.72 256.826 222.569C257.152 216.661 264.754 216.661 272.141 209.376C275.82 205.748 278.959 200.743 278.959 200.743C279.543 214.292 280.67 227.875 279.654 241.398C279.576 242.426 281.169 242.843 281.956 242.174C282.711 241.533 282.867 240.456 282.946 239.461L282.955 239.337C284.002 225.181 285.212 194.888 286.72 175.044C287.291 167.531 288.909 160.333 289.856 156.062C290.274 154.177 288.965 154.21 286.347 153.034C285.275 152.552 282.879 156.082 281.792 166.103L281.738 166.63C281.345 170.617 281.003 178.141 280.71 189.202C280.236 191.737 277.38 192.323 272.141 190.96L271.936 190.906C266.567 189.474 258.331 186.859 247.228 183.062L247.151 182.015C245.941 165.199 246.353 153.447 248.387 146.759L248.451 146.554C251.648 136.373 246.311 140.582 245.704 141.395C241.643 146.84 240.769 153.798 240.795 160.072L240.872 178.931C240.872 180.9 240.778 182.956 239.699 184.589C238.773 185.99 237.257 186.864 235.774 187.669L217.447 197.58C215.757 198.5 214.076 199.475 212.746 200.856C211.284 202.374 210.288 204.491 210.626 206.57C210.851 207.955 211.418 209.034 212.325 209.806L211.993 219.506C211.488 234.614 211.154 246.409 210.99 254.889Z"
                          fill="white"
                        />
                        <path
                          d="M121.426 255.785C121.447 256.856 119.775 257.203 118.99 256.472C118.206 255.741 118.113 254.553 118.072 253.482C117.512 239.062 116.953 224.632 117.25 210.204C104.595 213.991 91.9408 217.778 79.2863 221.565C79.8745 233.816 80.4626 246.066 81.0508 258.317C81.1029 259.402 79.4207 259.806 78.6009 259.091C77.7811 258.375 77.6467 257.174 77.5709 256.09C76.7903 244.931 76.279 233.753 76.0377 222.569C76.0076 221.176 74.9049 220.071 73.8784 219.127C67.2207 212.999 60.5631 206.871 53.9054 200.743C53.3215 214.292 53.5384 227.875 54.5546 241.398C54.6318 242.426 53.0387 242.843 52.2522 242.174C51.4657 241.506 51.3286 240.365 51.2526 239.337C49.6151 217.19 50.7256 194.909 49.0731 172.763C48.6759 167.44 48.1009 162.05 46.144 157.082C49.6477 156.268 90.5774 147.845 87.1099 142.521C91.7831 146.72 92.0952 153.798 92.0692 160.072C92.0438 166.227 92.0183 172.383 91.9928 178.539C91.9841 180.624 92.0143 182.847 93.1652 184.588C94.1283 186.046 95.7291 186.933 97.2675 187.765C103.149 190.945 109.03 194.126 114.911 197.306C116.767 198.309 118.655 199.337 120.118 200.856C121.58 202.374 122.576 204.491 122.238 206.57C121.9 208.648 119.924 210.491 117.832 210.211C120.049 210.683 119.835 210.183 120.539 209.806C120.834 225.133 121.13 240.459 121.426 255.785Z"
                          fill="white"
                        />
                        <path
                          d="M48.8677 160.999C48.2585 159.156 47.6493 157.314 47.04 155.471C47.8887 155.683 78.1166 145.005 83.6762 143.391C84.2197 143.233 84.5274 143.162 84.5489 143.196C88.1983 148.967 88.2829 156.216 88.2525 163.043C88.2243 169.383 88.1961 175.723 88.1679 182.063C88.1617 183.46 87.8803 185.232 86.525 185.573C78.5055 187.591 70.5998 190.06 62.8579 192.965C60.5748 193.822 58.1878 194.733 55.7679 194.43C54.4959 194.271 53.2919 193.782 52.105 193.298C51.3349 192.984 50.4339 192.486 50.4361 191.654C50.4541 184.86 50.4721 178.066 50.4902 171.272C50.4949 169.47 50.499 167.659 50.2058 165.882C49.9308 164.215 49.3983 162.603 48.8677 160.999Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M167.819 0.302302C167.609 0.3609 167.276 0.321043 167.309 0.105059C167.435 0.0404503 167.576 -0.0260287 167.713 0.0103021C167.849 0.0466328 167.938 0.244568 167.828 0.333585L167.819 0.302302Z"
                          fill="#00160A"
                        />
                        <path
                          d="M85.7664 141.626C90.4392 145.824 90.7513 152.903 90.7253 159.176C90.6999 165.331 90.6747 171.487 90.6492 177.643C90.6405 179.728 90.6704 181.951 91.821 183.692C92.7841 185.15 94.3853 186.037 95.9236 186.869C101.805 190.049 107.686 193.23 113.567 196.41C115.423 197.414 117.312 198.441 118.774 199.96C120.237 201.479 121.232 203.595 120.894 205.674C120.556 207.752 118.58 209.595 116.488 209.315C116.582 223.79 116.934 238.263 117.544 252.726C117.598 254.017 118.1 255.737 119.392 255.648C119.073 240.781 118.754 225.913 118.434 211.045C118.417 210.248 118.491 209.287 119.195 208.91C119.491 224.237 119.786 239.563 120.082 254.89C120.102 255.96 118.431 256.307 117.646 255.576C116.862 254.845 116.769 253.657 116.727 252.587C116.168 238.167 115.609 223.736 115.906 209.309C103.252 213.096 90.5966 216.883 77.9421 220.67C78.5303 232.92 79.1186 245.171 79.7068 257.421C79.7589 258.506 78.0764 258.911 77.2566 258.195C76.4368 257.48 76.3031 256.277 76.2273 255.193C75.4468 244.035 74.9355 232.857 74.6941 221.674C74.664 220.281 73.5605 219.175 72.5339 218.23C65.8764 212.103 59.2188 205.975 52.5613 199.848C51.9774 213.396 52.1945 226.979 53.2107 240.502C53.2879 241.53 51.6945 241.947 50.908 241.278C50.1217 240.61 49.9849 239.469 49.9089 238.441C48.2714 216.295 49.3817 194.013 47.7292 171.867C47.3321 166.544 46.7573 161.154 44.8005 156.186C47.2844 159.031 47.808 163.04 48.1433 166.799C50.1874 189.711 49.2139 212.782 50.3279 235.758C50.4247 237.754 50.6256 239.953 52.0671 241.341C51.8373 227.722 51.6076 214.103 51.3777 200.483C51.3602 199.446 51.361 198.341 51.9177 197.465C52.4747 196.588 53.8111 196.128 54.5798 196.827C61.682 203.287 68.7843 209.746 75.8865 216.206C76.696 216.942 77.7541 217.733 78.781 217.353C92.0519 212.431 105.548 208.113 119.212 204.414C120.582 204.043 119.781 201.943 118.705 201.02C111.727 195.031 102.662 192.109 94.8787 187.206C93.6009 186.401 92.3267 185.513 91.4744 184.269C90.4155 182.722 90.1168 180.79 89.9587 178.924C89.423 172.598 90.1807 166.238 90.156 159.89C90.1313 153.541 89.2337 146.95 85.7664 141.626ZM54.2468 197.875C53.7428 197.418 52.842 197.006 52.5007 197.594C52.2454 198.034 52.6442 198.555 53.0134 198.905C60.2232 205.75 67.4336 212.595 74.6433 219.439C75.578 220.327 75.6619 221.761 75.6853 223.048C75.8158 230.236 75.9465 237.424 76.0769 244.612C76.1632 249.369 76.309 254.353 78.6667 258.488C78.9509 246.199 77.5837 233.938 77.1228 221.654C77.1077 221.251 77.0999 220.821 77.3083 220.476C77.5734 220.036 78.1094 219.853 78.6013 219.703C91.6248 215.732 104.648 211.76 117.672 207.789C118.308 207.595 118.97 207.386 119.447 206.923C119.923 206.46 120.142 205.66 119.751 205.123C105.42 209.155 91.2291 213.68 77.2117 218.688C69.5565 211.751 61.9019 204.813 54.2468 197.875ZM88.0876 187.811C88.6557 187.723 89.4069 187.737 89.6003 188.264C80.935 189.716 72.4276 192.059 64.2664 195.241C62.929 195.763 61.6001 196.307 60.2722 196.851C59.6416 197.109 59.0112 197.368 58.3806 197.626C57.9511 197.204 58.5949 196.566 59.1501 196.318C68.3392 192.223 78.1045 189.352 88.0876 187.811ZM83.4792 142.562C83.8974 142.388 84.3068 142.814 84.5486 143.196C88.1979 148.968 88.283 156.216 88.2527 163.043C88.2245 169.383 88.1959 175.723 88.1677 182.063C88.1615 183.46 87.8804 185.232 86.5251 185.573C78.5057 187.591 70.6 190.06 62.8582 192.966C60.5752 193.823 58.1881 194.733 55.7683 194.431C54.4963 194.271 53.2921 193.782 52.1052 193.298C51.3351 192.984 50.4341 192.486 50.4363 191.654C50.4543 184.86 50.472 178.066 50.49 171.271C50.4948 169.471 50.4989 167.66 50.2058 165.883C49.9308 164.216 49.3984 162.603 48.8679 160.999C48.2587 159.157 47.649 157.314 47.0398 155.472C47.9714 155.704 48.5079 156.661 48.8806 157.545C51.5255 163.82 51.4339 170.861 51.3005 177.669C51.2172 181.925 51.1339 186.181 51.0505 190.437C51.0179 192.101 52.8099 193.213 54.448 193.515C58.2055 194.207 61.9439 192.556 65.5017 191.164C72.1738 188.553 79.1271 186.743 86.0613 184.938C87.1531 184.654 87.3715 183.224 87.3708 182.097C87.3659 174.638 87.3611 167.18 87.3562 159.722C87.355 157.849 87.3538 155.972 87.1707 154.108C86.7725 150.057 85.5053 146.093 83.4792 142.562ZM75.9919 115.054C79.0175 114.045 82.4252 115.633 84.4792 118.063C86.5333 120.494 87.5276 123.617 88.4744 126.65C89.4006 129.618 90.3264 132.587 91.2527 135.555C91.6212 136.736 91.9942 137.973 91.7742 139.19C91.554 140.407 90.5342 141.577 89.2937 141.521C81.5218 141.17 73.8208 143.209 66.5623 145.997C59.3038 148.785 52.3584 152.328 45.1238 155.177C43.4196 155.848 41.3589 156.444 39.8679 155.383C38.9753 154.748 38.5371 153.669 38.1433 152.649C36.7791 149.117 35.4148 145.585 34.0505 142.053C33.5299 140.705 33.0051 139.343 32.7957 137.914C32.1393 133.436 35.0662 128.698 39.3767 127.261C51.5818 123.192 63.7868 119.123 75.9919 115.054ZM79.2068 115.505C77.8506 115.293 76.4829 115.705 75.1736 116.116C63.1939 119.874 51.2869 123.864 39.4626 128.082C38.5047 128.424 37.5259 128.779 36.7419 129.425C35.8575 130.153 35.2899 131.201 34.9207 132.283C33.7289 135.776 34.448 139.639 35.7 143.111C36.952 146.583 38.7225 149.871 39.7009 153.43C40.0396 154.661 41.6762 154.953 42.9431 154.755C44.5125 154.509 45.9947 153.889 47.4529 153.262C54.2189 150.349 60.8805 147.168 67.8298 144.721C74.779 142.273 82.0815 140.562 89.4509 140.717C90.2002 140.733 90.8234 140.061 91.0037 139.337C91.1838 138.613 91.0251 137.851 90.8552 137.124C90.0857 133.831 89.074 130.6 88.0164 127.388C86.7818 123.638 85.3654 119.729 82.3777 117.137C81.4687 116.348 80.398 115.691 79.2068 115.505ZM44.5837 148.013C44.7871 147.841 45.0771 147.885 45.3123 147.994C45.6794 148.165 46.0055 148.496 46.1121 148.926C46.2185 149.356 46.0558 149.878 45.6951 150.065C45.0672 150.391 44.4005 149.556 44.3552 148.78C44.3388 148.499 44.3836 148.182 44.5837 148.013ZM45.3494 148.718C45.1353 148.657 44.9024 148.905 44.9451 149.148C45.0017 149.471 45.3809 149.557 45.6697 149.507L45.5212 149.313C45.6624 149.122 45.5634 148.779 45.3494 148.718ZM51.8972 144.912C52.3136 144.619 52.9706 144.773 53.2136 145.221C53.4565 145.668 53.2278 146.304 52.7556 146.494C52.348 146.658 51.8316 146.472 51.6218 146.086C51.412 145.7 51.5377 145.165 51.8972 144.912ZM52.1287 145.287C52.0357 145.63 52.3243 146.022 52.6794 146.034L52.697 145.973C52.7949 145.637 52.4764 145.253 52.1287 145.287ZM41.7673 141.626C42.0159 141.184 42.675 141.037 43.0906 141.33C43.5061 141.624 43.5817 142.291 43.2419 142.669C43.1518 142.769 43.0387 142.849 42.9138 142.9C42.6912 142.993 42.431 142.993 42.2087 142.899C41.7387 142.703 41.5187 142.068 41.7673 141.626ZM42.5056 141.787C42.3433 141.885 42.2203 142.046 42.1697 142.228C42.3366 142.382 42.545 142.492 42.7673 142.544L42.7742 142.561C43.0662 142.345 42.8694 141.778 42.5056 141.787ZM60.9324 140.835C60.8619 140.13 61.7692 139.567 62.3308 139.967C62.4985 140.086 62.6258 140.266 62.6843 140.469C62.7752 140.784 62.6907 141.146 62.4724 141.384C62.0021 141.895 61.003 141.539 60.9324 140.835ZM61.9314 140.538C61.7239 140.482 61.5006 140.717 61.5574 140.933C61.6144 141.148 61.9213 141.231 62.072 141.072C62.2228 140.913 62.1389 140.595 61.9314 140.538ZM49.1208 137.306C49.5893 136.917 50.3359 137.3 50.6902 137.786C50.9255 138.109 51.0945 138.493 51.0701 138.885C51.0456 139.277 50.7925 139.67 50.4001 139.793C49.9927 139.921 49.5286 139.73 49.2576 139.414C48.9866 139.098 48.8787 138.682 48.8416 138.276C48.8098 137.929 48.8446 137.535 49.1208 137.306ZM69.0222 137.716C69.1865 137.141 69.9566 137.015 70.4724 137.275C71.1336 137.61 71.5158 138.64 70.9753 139.161C70.4379 139.679 69.5166 139.227 69.1648 138.557C69.0305 138.301 68.9424 137.996 69.0222 137.716ZM50.1707 138.276C50.323 138.037 49.8944 137.767 49.6541 137.929C49.4136 138.091 49.4108 138.438 49.5261 138.695C49.6482 138.968 49.9382 139.217 50.2419 139.149C50.5454 139.081 50.604 138.561 50.2947 138.524L50.1707 138.276ZM70.4099 137.967C70.1466 137.791 69.7406 137.957 69.6599 138.273C69.7588 138.374 69.8579 138.475 69.9568 138.575C70.1254 138.653 70.294 138.731 70.4626 138.81C70.7018 138.599 70.6733 138.143 70.4099 137.967ZM79.0115 136.517C79.4328 135.976 80.285 136.341 80.7302 136.859C80.9028 137.06 81.0621 137.296 81.0857 137.565C81.1279 138.049 80.6777 138.476 80.2166 138.489C79.7556 138.502 79.3299 138.186 79.0759 137.78C78.8397 137.403 78.7392 136.866 79.0115 136.517ZM79.738 136.922C79.5575 137.095 79.5219 137.413 79.6599 137.625C79.7981 137.837 80.0926 137.918 80.3113 137.803C80.4628 137.644 80.3771 137.32 80.1697 137.267L80.1794 137.24C80.0323 137.134 79.8852 137.028 79.738 136.922ZM86.0173 135.255C86.0452 134.812 86.5196 134.367 87.0183 134.474C87.4828 134.573 87.6738 135.042 87.7898 135.443C87.9152 135.877 87.3686 136.314 86.8572 136.242C86.346 136.17 85.9894 135.701 86.0173 135.255ZM58.5359 133.118C58.8427 133.078 59.1269 133.293 59.3562 133.519C59.8651 134.02 60.2827 134.891 59.8542 135.476C59.4627 136.009 58.6335 135.833 58.2009 135.339C57.715 134.783 57.6126 133.768 58.1667 133.295C58.2739 133.203 58.4008 133.136 58.5359 133.118ZM87.0613 135.308C86.9647 135.193 86.7324 135.195 86.6394 135.312C86.5464 135.43 86.6289 135.619 86.7888 135.654L86.7595 135.738C87.0052 135.772 87.2103 135.48 87.0613 135.308ZM58.6707 133.888C58.3655 133.935 58.372 134.432 58.5203 134.727C58.6874 135.059 59.0963 135.367 59.3503 135.108C59.6111 134.843 59.3463 134.381 59.0876 134.113C58.971 133.992 58.8298 133.863 58.6707 133.888ZM38.6365 132.566C38.9407 132.094 39.6962 132.148 40.1794 132.45C40.6454 132.741 40.9866 133.409 40.6003 133.794C40.4041 133.989 40.093 134.026 39.8123 134.004C39.4338 133.974 39.0473 133.85 38.7888 133.581C38.5302 133.312 38.4356 132.878 38.6365 132.566ZM39.1755 133.058C39.3626 133.365 39.7776 133.522 40.1306 133.42C40.18 133.163 39.9539 132.891 39.6843 132.882L39.656 132.826C39.4959 132.903 39.3356 132.981 39.1755 133.058ZM69.3064 130.433C69.6453 130.39 69.9798 130.546 70.2302 130.749C70.6587 131.096 70.9189 131.65 70.7107 132.125C70.5022 132.6 69.7157 132.85 69.2869 132.504C68.9219 132.209 68.5993 131.838 68.5496 131.407C68.4999 130.977 68.8131 130.495 69.3064 130.433ZM46.3875 130.008C46.7987 129.898 47.239 130.106 47.5388 130.413C47.983 130.868 48.1266 131.745 47.5916 132.084C47.436 132.182 47.2483 132.217 47.0652 132.218C46.512 132.221 45.9441 131.891 45.7546 131.362C45.5652 130.834 45.8527 130.151 46.3875 130.008ZM69.7253 131.098C69.5384 131.004 69.2487 131.05 69.1804 131.228C69.1398 131.334 69.1865 131.448 69.2351 131.552C69.3491 131.794 69.5207 132.065 69.8191 132.103C70.1174 132.14 70.3553 131.706 70.0701 131.622L70.0945 131.547C70.0154 131.373 69.9123 131.191 69.7253 131.098ZM46.8308 130.666C46.4811 130.58 46.2544 131.145 46.4939 131.418C46.7333 131.691 47.1746 131.663 47.491 131.489C47.2742 131.219 47.0574 130.949 46.8406 130.679L46.8308 130.666ZM78.0662 127.291C78.4719 127.317 78.803 127.641 79.0203 127.993C79.3976 128.605 79.4432 129.59 78.8044 129.898C78.3471 130.119 77.7911 129.846 77.4646 129.45C77.1649 129.087 76.9854 128.593 77.0828 128.128C77.1803 127.663 77.6031 127.262 78.0662 127.291ZM85.2634 127.745C85.9245 127.837 86.2623 128.793 85.8064 129.281C85.3503 129.769 84.3759 129.495 84.24 128.841C84.121 128.268 84.6843 127.665 85.2634 127.745ZM78.5447 128.319C78.2548 128.1 77.7655 128.319 77.7253 128.687C77.6852 129.054 78.1151 129.378 78.4451 129.23C78.7747 129.082 78.8343 128.539 78.5447 128.319ZM85.5486 128.669C85.5219 128.41 85.1767 128.242 84.9646 128.393C84.7531 128.543 84.8144 128.941 85.0652 129.008L85.0408 129.103C85.2939 129.162 85.5752 128.928 85.5486 128.669ZM55.2937 126.202C55.6736 125.784 56.3593 125.936 56.8298 126.242C57.1298 126.437 57.4292 126.775 57.322 127.123C57.2649 127.308 57.1038 127.439 56.9382 127.532C56.4999 127.779 55.9271 127.829 55.5134 127.541C55.0997 127.253 54.9527 126.578 55.2937 126.202ZM56.0886 126.579C55.953 126.423 55.6652 126.606 55.6882 126.813C55.7114 127.021 55.9376 127.152 56.1404 127.14C56.3433 127.128 56.5251 127.013 56.697 126.901C56.5933 126.677 56.3554 126.525 56.114 126.529L56.0886 126.579ZM64.9607 124.11C64.9864 123.431 65.8873 123.165 66.5583 123.286C66.8721 123.343 67.1917 123.45 67.4138 123.678C67.6359 123.906 67.7298 124.28 67.5623 124.551C67.4174 124.784 67.1297 124.881 66.8621 124.946C66.4702 125.041 66.0525 125.104 65.6677 124.983C65.283 124.863 64.9455 124.512 64.9607 124.11ZM82.6111 122.362C82.8169 122.368 82.9994 122.502 83.1677 122.631C83.4496 122.847 83.7315 123.064 84.0134 123.28C84.4102 123.585 84.204 124.357 83.7488 124.541C83.2935 124.725 82.7775 124.469 82.4294 124.1C82.1816 123.837 81.9794 123.49 81.9841 123.113C81.9889 122.736 82.2657 122.352 82.6111 122.362ZM67.0857 124.253C66.9918 123.966 66.6043 123.82 66.3435 123.975L66.2996 123.972C66.023 123.817 65.6204 123.992 65.5457 124.299C66.0103 124.578 66.6387 124.559 67.0857 124.253ZM83.032 123.267C82.926 123.067 82.6043 123.085 82.5173 123.295C82.7717 123.712 83.1836 124.011 83.6345 124.106C83.692 123.736 83.4193 123.346 83.0769 123.308L83.032 123.267ZM74.9373 120.366C75.2519 119.939 76.0037 120.135 76.4285 120.476C76.9281 120.876 77.2875 121.59 76.8777 122.066C76.5587 122.437 75.8942 122.444 75.4763 122.166C75.0587 121.888 74.8613 121.404 74.822 120.936C74.8056 120.74 74.817 120.53 74.9373 120.366ZM76.1531 121.138C76.2374 120.912 75.8501 120.722 75.6414 120.867C75.4328 121.013 75.4493 121.322 75.6101 121.511C75.7711 121.7 76.0301 121.795 76.28 121.87C76.4012 121.656 76.4049 121.391 76.2898 121.174L76.1531 121.138Z"
                          fill="#00160A"
                        />
                        <path
                          d="M256.495 218.698C256.956 218.568 257.174 219.226 257.15 219.685C256.544 231.72 255.937 243.756 255.331 255.792C255.282 256.775 255.191 257.852 254.471 258.555C253.751 259.257 252.188 259.133 251.998 258.166C251.67 256.49 251.774 254.767 251.88 253.064C252.556 242.207 253.234 231.35 253.91 220.493C253.937 220.063 254.273 219.468 254.646 219.708C253.804 232.33 253.038 244.957 252.346 257.587C252.308 258.282 253.44 258.535 253.979 258.067C254.519 257.6 254.59 256.826 254.625 256.131L256.495 218.698ZM216.132 209.776C216.147 209.326 216.394 208.703 216.832 208.846C216.355 223.299 215.878 237.752 215.4 252.205C215.369 253.144 213.923 253.471 213.17 252.884C212.417 252.297 212.225 251.272 212.124 250.338C211.581 245.31 212.163 240.241 212.569 235.201C213.268 226.523 213.445 217.804 213.099 209.105C213.089 208.853 213.491 208.761 213.685 208.93C213.879 209.098 213.908 209.379 213.923 209.632C214.616 221.315 213.219 233.007 212.632 244.695C212.52 246.918 212.442 249.181 213.022 251.333C213.137 251.757 213.304 252.211 213.689 252.438C214.075 252.664 214.714 252.472 214.729 252.034C215.196 237.948 215.664 223.862 216.132 209.776ZM247.243 140.729C244.216 146.484 243.837 153.219 243.716 159.716C243.627 164.479 243.643 169.245 243.765 174.008C243.853 177.475 243.903 181.255 241.785 184.006C240.131 186.154 237.476 187.23 234.986 188.312C229.845 190.544 224.882 193.186 220.16 196.203C217.528 197.885 214.91 199.744 213.157 202.325C226.841 205.661 240.344 209.737 253.586 214.53C256.242 215.492 259.051 213.768 261.348 212.128C266.798 208.235 272.346 204.248 276.296 198.847C277.662 196.979 279.308 194.707 281.617 194.915C281.378 210.644 281.139 226.373 280.899 242.102C282.257 241.537 282.506 239.759 282.553 238.292C283.177 218.567 283.801 198.842 284.425 179.117C284.679 171.082 285.064 162.605 289.408 155.832C285.714 163.275 285.367 171.867 285.091 180.166C284.435 199.847 283.779 219.528 283.124 239.209C283.09 240.232 283.006 241.372 282.253 242.067C281.5 242.763 279.896 242.398 279.95 241.376C280.76 226.13 281.001 210.854 280.677 195.591C278.582 196.365 277.585 198.67 276.548 200.644C272.972 207.446 266.65 212.365 260.194 216.556C258.677 217.54 257.082 218.52 255.289 218.77C253.484 219.021 251.67 218.506 249.921 217.996C237.617 214.411 225.312 210.826 213.008 207.241C212.714 206.08 212.632 204.482 213.758 204.066C212.888 205.186 214.595 206.494 215.958 206.894C227.332 210.224 238.705 213.555 250.079 216.885C252.028 217.456 254.063 218.032 256.064 217.686C257.673 217.407 259.117 216.555 260.481 215.661C266.184 211.926 271.223 207.188 275.297 201.73C271.247 205.168 267.196 208.606 263.146 212.044C261.98 213.033 260.793 214.037 259.389 214.644C255.775 216.205 251.634 214.851 247.914 213.561C236.688 209.665 225.245 206.393 213.654 203.765C212.513 203.506 212.076 201.982 212.527 200.905C212.979 199.829 214.003 199.118 214.981 198.479C222.194 193.768 229.776 189.619 237.634 186.081C238.636 185.63 239.66 185.177 240.479 184.445C242.608 182.545 242.814 179.35 242.869 176.502C243.016 168.898 243.162 161.293 243.309 153.688C243.398 149.035 243.742 143.807 247.243 140.729ZM288.446 147.16C288.739 146.778 289.206 146.405 289.626 146.613C289.738 146.669 289.837 146.774 289.854 146.904C289.865 146.997 289.835 147.089 289.805 147.177C289.751 147.334 289.696 147.491 289.643 147.648C289.533 147.967 289.418 148.297 289.19 148.534C288.963 148.771 288.589 148.886 288.32 148.703C287.857 148.388 288.098 147.614 288.446 147.16ZM289.197 147.168C288.735 147.306 288.459 147.921 288.647 148.392C288.783 148.209 288.92 148.026 289.056 147.844L289.041 147.825C289.21 147.667 289.275 147.393 289.197 147.168ZM283.256 143.427C283.383 143.446 283.519 143.506 283.565 143.626C283.596 143.704 283.583 143.792 283.566 143.874C283.494 144.241 283.374 144.598 283.21 144.935C283.003 145.358 282.56 145.803 282.128 145.612C281.678 145.414 281.74 144.748 281.968 144.312C282.226 143.82 282.704 143.345 283.256 143.427ZM282.689 144.19C282.53 144.241 282.447 144.453 282.53 144.598C282.648 144.614 282.783 144.564 282.83 144.455C282.877 144.346 282.791 144.193 282.673 144.204L282.689 144.19ZM292.029 140.301C292.122 140.279 292.222 140.268 292.31 140.311C292.451 140.38 292.512 140.565 292.532 140.735C292.625 141.503 292.138 142.304 291.461 142.496C291.173 142.578 290.77 142.464 290.754 142.135C290.713 141.295 291.287 140.472 292.029 140.301ZM292.087 140.85C291.637 140.961 291.281 141.43 291.259 141.94C291.545 141.889 291.805 141.681 291.939 141.396L291.942 141.389C292.077 141.258 292.135 141.04 292.087 140.85ZM272.628 138.71C272.862 138.53 273.206 138.39 273.433 138.58C273.503 138.639 273.55 138.722 273.587 138.807C273.711 139.086 273.755 139.402 273.713 139.705C273.622 140.365 272.883 140.974 272.319 140.63C271.995 140.432 271.873 139.989 271.966 139.617C272.059 139.246 272.326 138.941 272.628 138.71ZM272.591 139.598L272.595 139.597C272.394 139.723 272.426 140.087 272.646 140.176C273.062 140.042 273.292 139.497 273.099 139.101C272.93 139.266 272.76 139.432 272.591 139.598ZM285.259 136.266C285.382 136.244 285.517 136.235 285.627 136.294C285.855 136.416 285.848 136.735 285.789 136.982C285.694 137.383 285.543 137.771 285.342 138.132C285.043 138.667 284.348 139.186 283.858 138.808C283.599 138.607 283.55 138.236 283.603 137.917C283.736 137.106 284.431 136.412 285.259 136.266ZM263.18 136.698C263.525 136.226 264.261 136.104 264.739 136.439C264.878 136.537 264.994 136.666 265.077 136.814C265.296 137.207 265.252 137.731 264.972 138.081C264.606 138.537 263.865 138.627 263.402 138.27C262.94 137.913 262.835 137.171 263.18 136.698ZM285.067 136.904C284.477 137.128 284.11 137.808 284.254 138.411C284.533 138.07 284.813 137.729 285.092 137.388C285.175 137.287 285.262 137.161 285.222 137.038C285.2 136.971 285.138 136.918 285.067 136.904ZM264.578 137.062C264.366 136.795 263.869 136.872 263.745 137.189C263.622 137.507 263.936 137.902 264.271 137.851C264.607 137.799 264.79 137.328 264.578 137.062ZM253.617 135C253.854 134.371 254.85 134.26 255.216 134.82C255.446 135.173 255.395 135.688 255.101 135.986C254.987 136.102 254.842 136.185 254.687 136.226C254.047 136.392 253.38 135.629 253.617 135ZM254.583 135.023C254.373 134.985 254.152 135.171 254.149 135.389C254.147 135.606 254.365 135.798 254.575 135.764C254.801 135.563 254.834 135.175 254.646 134.937L254.583 135.023ZM246.603 132.902C246.872 132.58 247.421 132.58 247.641 132.945C247.847 133.288 247.712 133.753 247.52 134.105C247.454 134.226 247.377 134.347 247.264 134.411C247.023 134.547 246.723 134.364 246.569 134.119C246.343 133.758 246.333 133.225 246.603 132.902ZM275.642 132.246C275.963 132.119 276.324 132.431 276.396 132.804C276.469 133.176 276.326 133.561 276.131 133.874C275.942 134.177 275.664 134.458 275.333 134.457C274.857 134.455 274.531 133.818 274.648 133.302C274.766 132.786 275.193 132.424 275.642 132.246ZM295.146 131.847C295.558 131.609 296.203 131.951 296.121 132.475C296.029 133.063 295.82 133.701 295.349 133.946C294.877 134.192 294.181 133.678 294.367 133.121C294.534 132.625 294.733 132.085 295.146 131.847ZM275.911 132.935C275.474 132.852 275.037 133.36 275.127 133.845C275.217 133.915 275.334 133.942 275.441 133.915C275.527 133.692 275.663 133.493 275.832 133.341L275.857 133.338C275.875 133.203 275.893 133.069 275.911 132.935ZM247.178 133.346C247.091 133.28 246.95 133.372 246.96 133.487L246.892 133.484C246.891 133.609 247.028 133.707 247.132 133.657C247.236 133.607 247.262 133.43 247.178 133.346ZM295.451 132.342C295.175 132.558 294.996 132.933 294.985 133.318C295.234 133.378 295.503 133.139 295.518 132.847V132.852C295.679 132.738 295.635 132.395 295.451 132.342ZM264.704 129.849C264.992 129.586 265.498 129.413 265.843 129.624C266.152 129.814 266.153 130.197 266.054 130.505C265.925 130.904 265.578 131.331 265.08 131.321C264.699 131.314 264.381 131.025 264.329 130.712C264.277 130.399 264.448 130.082 264.704 129.849ZM287.641 129.128C287.947 129.009 288.352 129.122 288.473 129.441C288.548 129.641 288.501 129.866 288.446 130.072C288.346 130.449 288.209 130.836 287.929 131.092C287.648 131.348 287.186 131.419 286.916 131.15C286.588 130.823 286.723 130.242 286.951 129.831C287.116 129.534 287.335 129.247 287.641 129.128ZM287.936 129.639C287.475 129.775 287.16 130.32 287.256 130.814C287.587 130.644 287.864 130.357 288.031 130.011C288.064 129.944 288.093 129.87 288.081 129.796C288.068 129.72 288.008 129.654 287.936 129.639ZM265.288 130.067C264.996 130.216 264.903 130.579 265.098 130.812C265.289 130.704 265.436 130.544 265.511 130.362L265.524 130.384C265.676 130.265 265.484 130.008 265.288 130.067ZM256.614 125.946C256.912 125.965 257.132 126.288 257.15 126.605C257.169 126.923 257.036 127.227 256.885 127.501C256.693 127.849 256.144 127.793 255.933 127.459C255.721 127.125 255.799 126.654 256.017 126.324C256.156 126.113 256.373 125.931 256.614 125.946ZM256.623 126.471C256.468 126.574 256.349 126.737 256.291 126.922L256.285 126.927C256.297 127.069 256.309 127.211 256.321 127.354C256.625 127.216 256.773 126.784 256.623 126.471ZM249.136 125.888C249.31 125.483 249.921 125.363 250.234 125.672C250.31 125.746 250.367 125.839 250.401 125.939C250.542 126.357 250.169 126.859 249.73 126.841C249.292 126.822 248.961 126.292 249.136 125.888ZM278.864 124.604C279.297 124.643 279.59 125.091 279.548 125.495C279.506 125.899 279.214 126.245 278.879 126.504C278.573 126.74 278.159 126.932 277.789 126.797C277.409 126.658 277.244 126.208 277.339 125.837C277.434 125.466 277.727 125.167 278.043 124.925C278.278 124.744 278.561 124.578 278.864 124.604ZM249.833 125.924C249.7 125.965 249.634 126.146 249.709 126.264L249.707 126.256C249.9 126.295 250.029 125.928 249.833 125.924ZM279.159 125.397C279.01 125.179 278.642 125.184 278.419 125.339C278.196 125.494 278.084 125.748 277.98 125.988C278.088 126.06 278.197 126.131 278.305 126.203L278.321 126.176C278.6 125.916 278.88 125.657 279.159 125.397ZM268.31 122.119C268.77 121.694 269.67 121.96 269.695 122.614C269.71 123.004 269.439 123.333 269.165 123.587C268.898 123.835 268.6 124.063 268.258 124.149C268.151 124.176 268.071 124.047 268.032 123.937C267.818 123.324 267.85 122.545 268.31 122.119ZM269.052 122.492C268.641 122.462 268.352 123.016 268.474 123.441C268.84 123.328 269.108 122.919 269.087 122.508L269.052 122.492ZM258.701 118.896C258.949 118.752 259.31 118.725 259.536 118.894C259.631 118.965 259.694 119.063 259.741 119.163C259.954 119.618 259.824 120.213 259.338 120.471C258.852 120.728 258.068 120.453 258.049 119.963C258.043 119.807 258.107 119.655 258.18 119.512C258.299 119.276 258.454 119.041 258.701 118.896ZM259.158 119.352C258.756 119.457 258.567 119.939 258.815 120.23C259.014 120.069 259.154 119.855 259.211 119.626L259.213 119.627C259.361 119.585 259.314 119.349 259.158 119.352Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M292.359 125.181C294.749 125.997 297.237 126.875 298.985 128.71C301.175 131.008 301.805 134.469 301.379 137.626C300.952 140.782 299.602 143.726 298.268 146.615C296.761 149.88 295.254 153.145 293.746 156.41C288.777 154.002 284.504 150.368 279.751 147.551C269.382 141.406 256.996 139.358 244.979 139.924C243.968 139.972 242.654 139.828 242.406 138.84C242.332 138.546 242.381 138.236 242.432 137.937C243.592 131.187 245.85 124.63 249.089 118.606C249.569 117.714 250.078 116.822 250.777 116.09C252.39 114.399 254.853 113.757 257.179 113.86C259.504 113.963 261.745 114.723 263.949 115.476C273.419 118.711 282.889 121.946 292.359 125.181ZM249.158 119.964C246.335 125.647 243.975 131.669 243.325 137.99C243.297 138.262 243.275 138.553 243.402 138.795C243.657 139.286 244.333 139.31 244.881 139.274C257.592 138.437 270.729 140.938 281.513 147.768C285.198 150.102 288.584 152.915 292.407 155.015C292.576 155.107 292.768 155.201 292.952 155.147C293.138 155.093 293.25 154.908 293.344 154.737C295.666 150.514 297.724 146.143 299.5 141.658C300.13 140.069 300.73 138.441 300.886 136.736C301.279 132.446 298.456 128.067 294.405 126.684C284.023 123.14 273.64 119.596 263.258 116.051C261.36 115.403 259.437 114.75 257.439 114.605C255.44 114.461 253.324 114.879 251.783 116.169C250.597 117.162 249.848 118.575 249.158 119.964Z"
                          fill="#00160A"
                        />
                        <path
                          d="M139.333 184.186C140.514 184.864 141.048 186.284 141.441 187.606C143.707 195.234 144.236 203.267 144.75 211.219C145.019 215.37 145.288 219.522 145.556 223.673C145.703 225.95 145.579 228.753 143.587 229.801C140.426 231.465 137.912 234.363 136.681 237.763C135.234 241.762 135.559 246.161 135.484 250.423C135.408 254.685 134.769 259.265 131.897 262.366C131.424 262.877 130.858 263.357 130.176 263.464C129.495 263.571 128.698 263.164 128.589 262.471C128.439 261.509 129.556 260.88 130.494 260.69C131.431 260.501 132.57 260.308 132.922 259.403C135.897 251.769 132.714 242.389 136.829 235.325C137.899 233.487 139.403 231.947 141.018 230.582C142.43 229.389 144.028 228.185 144.532 226.39C144.788 225.475 144.726 224.503 144.662 223.554C144.246 217.433 143.831 211.312 143.416 205.191C143.256 202.847 143.097 200.501 142.781 198.174C142.133 193.405 140.833 188.751 139.333 184.186ZM131.668 261.436C131.317 261.167 130.817 261.175 130.414 261.352C130.01 261.528 129.684 261.848 129.383 262.174C129.311 262.253 129.236 262.34 129.218 262.446C129.186 262.648 129.388 262.827 129.588 262.842C129.789 262.856 129.98 262.755 130.153 262.649C130.706 262.313 131.217 261.904 131.668 261.436ZM193.775 183.308C193.264 186.647 191.962 189.799 190.859 192.988C187.514 202.658 185.949 212.958 186.268 223.2C186.326 225.061 186.495 227.054 187.65 228.501C188.528 229.602 189.86 230.228 190.846 231.23C192.836 233.254 193.089 236.391 193.225 239.246C193.36 242.081 193.495 244.915 193.63 247.75C193.73 249.845 193.836 251.974 194.517 253.954C195.198 255.934 196.546 257.782 198.471 258.547C198.437 257.415 200.112 256.727 200.864 257.564C201.615 258.402 200.783 260.03 199.675 259.889C196.613 259.499 194.305 256.701 193.362 253.72C192.419 250.738 192.534 247.538 192.399 244.41C192.293 241.95 192.026 239.496 191.602 237.071C191.28 235.232 190.839 233.345 189.716 231.864C188.507 230.27 186.586 229.259 185.677 227.472C184.949 226.039 184.993 224.345 185.055 222.734C185.311 216.066 185.573 209.348 187.078 202.852C187.718 200.087 188.579 197.38 189.44 194.678C190.539 191.225 191.639 187.773 192.738 184.32C192.901 183.807 193.26 183.175 193.775 183.308ZM200.068 258.009C199.837 257.722 199.296 257.85 199.203 258.208C199.109 258.566 199.498 258.947 199.851 258.851C200.203 258.754 200.358 258.246 200.129 257.957L200.068 258.009ZM168.901 232.569C169.466 233.02 169.543 233.844 169.58 234.572C169.907 241.118 170.673 247.642 171.871 254.083C171.911 253.173 173.293 252.822 173.905 253.489C174.516 254.156 174.315 255.314 173.664 255.94C173.497 256.101 173.3 256.239 173.076 256.29C172.36 256.454 171.766 255.72 171.463 255.041C170.794 253.539 170.573 251.878 170.36 250.244C169.594 244.378 168.827 238.487 168.901 232.569ZM173.427 253.944C173.345 253.618 172.833 253.8 172.666 254.091C172.485 254.404 172.408 254.777 172.447 255.138C172.564 255.16 172.681 255.183 172.797 255.205C172.974 254.905 173.15 254.605 173.327 254.306C173.392 254.195 173.459 254.069 173.427 253.944ZM171.822 184.67C172.277 184.458 172.529 185.22 172.472 185.728C171.109 197.921 170.211 210.172 169.884 222.44C169.877 222.709 169.477 222.797 169.276 222.623C169.075 222.449 169.032 222.154 169.007 221.886C168.826 219.917 168.9 217.933 168.989 215.958C169.448 205.711 170.291 195.483 171.515 185.302C171.545 185.057 171.602 184.772 171.822 184.67ZM152.667 162.682C141.123 164.48 129.132 166.454 119.539 173.208C118.91 173.651 118.223 174.264 118.309 175.035C139.355 180.579 161.398 180.822 183.121 179.842C186.844 179.674 190.571 179.47 194.261 178.944C198.164 178.388 202.017 177.472 205.757 176.211C206.943 175.811 208.184 175.328 208.938 174.317C209.691 173.307 209.678 171.612 208.598 170.975C197.348 164.338 183.657 164.062 170.642 163.965C184.224 162.263 198.281 164.673 210.556 170.808C212.003 171.531 213.671 172.874 213.15 174.422C212.954 175.003 212.475 175.434 212 175.814C206.437 180.258 199.045 181.386 192.007 182.185C189.273 182.495 186.535 182.778 183.792 183.008C162.033 184.83 139.998 183.23 118.716 178.283C117.464 177.992 116.004 177.497 115.656 176.242C115.233 174.717 116.763 173.413 118.118 172.623C128.601 166.512 140.581 163.065 152.667 162.682ZM209.07 170.949C209.741 171.615 210.467 172.436 210.33 173.378C210.264 173.824 210.007 174.218 209.718 174.562C208.203 176.371 205.82 177.132 203.548 177.701C192.311 180.518 180.619 180.715 169.045 180.898C165.121 180.96 161.196 181.023 157.272 180.934C145.032 180.655 132.863 178.904 120.839 176.563C119.824 176.366 118.711 176.103 118.105 175.253C117.65 174.614 117.793 173.573 118.331 173.119C118.545 173.03 118.765 172.956 118.986 172.897C118.729 172.884 118.508 172.969 118.331 173.119C117.553 173.441 116.855 173.964 116.52 174.73C116.093 175.708 116.535 177.089 117.562 177.334C139.567 182.594 162.406 184.252 184.925 182.223C188.642 181.888 192.35 181.454 196.052 180.979C197.959 180.735 199.87 180.479 201.729 179.984C205.241 179.05 208.476 177.291 211.663 175.526C212.639 174.985 212.639 173.452 211.944 172.57C211.249 171.689 210.128 171.298 209.07 170.949ZM167.728 108.14C168.617 107.723 169.582 108.525 170.186 109.294C170.79 110.063 171.56 110.972 172.531 110.812C173.952 110.577 175.45 111.703 175.606 113.122C176.618 112.808 177.706 112.737 178.751 112.915C177.355 113.461 176.307 114.615 175.307 115.725C174.307 116.834 173.243 117.978 171.833 118.492C170.424 119.007 168.573 118.658 167.879 117.339C162.462 122.612 160.136 130.805 161.984 138.104C162.452 139.952 163.172 141.785 163.09 143.688C163.061 144.383 162.926 145.102 163.158 145.758C163.389 146.414 164.184 146.944 164.794 146.602C165.879 145.993 167.265 147.104 167.457 148.324C167.648 149.544 167.09 150.739 166.672 151.902C164.912 156.803 165.551 162.21 166.554 167.315C166.765 168.39 166.986 169.537 166.568 170.551C165.906 172.156 163.941 172.772 162.198 172.923C159.892 173.122 157.546 172.844 155.352 172.115C154.672 171.889 153.957 171.58 153.6 170.963C153.359 170.545 153.319 170.045 153.303 169.563C153.243 167.768 153.438 165.965 153.88 164.223C154.302 162.563 154.945 160.961 155.279 159.282C155.948 155.919 155.344 152.449 154.739 149.073C154.478 147.617 156.182 146.538 157.67 146.43C159.159 146.321 160.718 146.715 162.115 146.193C163.263 140.019 160.236 133.291 154.834 130.009C153.904 129.444 152.727 128.97 151.755 129.462C149.085 130.813 145.598 130.367 143.362 128.389C143.128 128.182 142.891 127.918 142.914 127.608C142.944 127.194 143.402 126.966 143.795 126.819C145.213 126.292 146.663 125.757 148.176 125.712C149.69 125.666 151.306 126.197 152.179 127.422C153.129 128.754 154.741 129.415 156.151 130.256C157.815 131.249 159.28 132.571 160.432 134.121C160.128 128.352 162.235 122.494 166.153 118.215C166.851 117.452 167.665 116.533 167.408 115.535C167.077 114.253 167.817 112.974 168.298 111.74C168.78 110.506 168.871 108.824 167.728 108.14ZM120.071 172.157C119.897 172.008 119.585 172.089 119.504 172.306L119.415 172.211C119.305 172.357 119.514 172.569 119.691 172.528C119.867 172.488 119.979 172.315 120.071 172.157ZM156.128 159.855C154.667 162.783 153.918 166.057 153.96 169.323C153.967 169.827 154.006 170.37 154.326 170.762C154.566 171.056 154.93 171.221 155.285 171.36C157.8 172.349 160.603 172.605 163.258 172.089C164.339 171.879 165.525 171.432 165.939 170.421C166.184 169.823 166.102 169.149 166.016 168.509C165.691 166.082 165.365 163.655 165.04 161.228C165.003 160.955 164.958 160.664 164.772 160.46C164.537 160.203 164.152 160.159 163.803 160.137C163.181 160.097 162.543 160.073 161.95 160.263C161.356 160.453 160.81 160.901 160.678 161.505C160.32 163.145 159.622 164.713 158.641 166.081C158.277 165.939 158.378 165.406 158.543 165.055C159.013 164.057 159.482 163.06 159.952 162.062C160.04 161.875 160.129 161.662 160.054 161.469C159.975 161.264 159.744 161.167 159.537 161.092C158.401 160.68 157.264 160.267 156.128 159.855ZM156.181 148.146C155.956 148.117 155.682 148.11 155.551 148.294C155.472 148.406 155.476 148.555 155.484 148.692C155.696 152.334 156.653 155.99 156.044 159.588C157.195 159.392 158.427 159.727 159.314 160.479C159.575 160.699 160.003 160.585 160.228 160.328C160.453 160.072 160.527 159.722 160.593 159.389C161.189 156.387 161.785 153.384 162.381 150.382C162.482 149.874 162.527 149.231 162.083 148.958C161.926 148.861 161.735 148.836 161.551 148.813C159.761 148.591 157.971 148.368 156.181 148.146ZM166.977 147.975C165.848 148.678 164.456 148.954 163.14 148.738C162.855 151.931 162.303 155.1 161.494 158.203C161.332 158.823 161.159 159.472 161.312 160.094C162.162 159.473 163.324 159.293 164.325 159.63C164.539 159.702 164.775 159.541 164.868 159.337C164.96 159.132 164.949 158.898 164.941 158.674C164.811 155.034 166.216 151.538 166.977 147.975ZM164.133 147.376C163.846 147.379 163.536 147.388 163.307 147.56C163.078 147.731 163.007 148.13 163.247 148.287C164.181 148.238 165.109 148.077 166.005 147.811C166.187 147.756 166.293 147.529 166.216 147.357C165.522 147.364 164.828 147.37 164.133 147.376ZM161.571 147.275C160.057 147.159 158.514 147.045 157.036 147.391C158.707 147.816 160.42 148.077 162.143 148.169C162.424 148.184 162.53 147.753 162.346 147.543C162.162 147.332 161.851 147.297 161.571 147.275ZM147.955 126.331C146.367 126.41 144.872 127.066 143.448 127.764C144.536 128.557 145.759 129.167 147.05 129.561C147.459 129.685 148.384 130.051 150.378 129.228L151.927 128.027C151.129 127.093 149.442 126.257 147.955 126.331ZM169.346 109.208C169.097 109.32 169.184 109.682 169.257 109.943C169.64 111.303 168.503 112.577 168.105 113.933C167.822 114.898 167.939 115.992 168.507 116.824C169.075 117.657 170.111 118.183 171.118 118.059C172.657 117.869 173.631 116.401 174.692 115.279C175.267 114.672 175.919 114.135 176.628 113.688C173.981 113.396 171.233 114.126 169.087 115.689C168.839 115.252 169.249 114.721 169.695 114.482C170.141 114.244 170.681 114.101 170.958 113.681C171.168 113.363 171.174 112.956 171.131 112.579C170.986 111.289 170.335 110.06 169.346 109.208ZM172.298 111.396C171.955 111.422 171.523 111.758 171.754 112.011C171.946 112.219 171.818 112.545 171.712 112.807C171.607 113.068 171.588 113.453 171.856 113.546C171.957 113.581 172.069 113.556 172.173 113.532C172.899 113.365 173.624 113.198 174.349 113.03C174.481 113 174.624 112.962 174.704 112.854C174.848 112.658 174.693 112.385 174.52 112.213C173.944 111.642 173.111 111.335 172.298 111.396Z"
                          fill="#00160A"
                        />
                        <path
                          d="M174.349 232.386C171.626 232.201 168.903 232.017 166.18 231.832C162.425 231.578 158.658 231.322 154.965 230.604C152.386 230.102 149.853 229.376 147.403 228.437C147.136 228.334 146.858 228.221 146.68 228C146.338 227.579 146.508 226.915 146.904 226.543C147.3 226.171 147.853 226.021 148.384 225.893C159.607 223.188 171.39 224.929 182.756 226.964C183.617 227.118 184.503 227.284 185.235 227.757C185.966 228.231 186.511 229.096 186.335 229.943C186.127 230.937 185.072 231.504 184.095 231.817C180.98 232.818 177.617 232.607 174.349 232.386"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M174.349 232.386C171.626 232.201 168.903 232.017 166.18 231.832C162.425 231.578 158.658 231.322 154.965 230.604C152.386 230.102 149.853 229.376 147.403 228.437C147.136 228.334 146.858 228.221 146.68 228C146.338 227.579 146.508 226.915 146.904 226.543C147.3 226.171 147.853 226.021 148.384 225.893C159.607 223.188 171.39 224.929 182.756 226.964C183.617 227.118 184.503 227.284 185.235 227.757C185.966 228.231 186.511 229.096 186.335 229.943C186.127 230.937 185.072 231.504 184.095 231.817C180.98 232.818 177.617 232.607 174.349 232.386M147.149 227.667C155.981 230.685 165.478 231.068 174.815 231.423C177.107 231.51 179.401 231.597 181.694 231.539C182.599 231.517 183.583 231.441 184.256 230.842C184.929 230.242 184.969 228.933 184.13 228.596C179.254 226.638 173.897 226.276 168.645 225.947C162.394 225.555 156.072 225.18 149.903 226.248C148.847 226.431 147.673 226.743 147.149 227.667Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M281.634 190.461C282.172 187.486 282.459 184.465 282.49 181.441C282.538 176.798 281.984 172.154 282.246 167.518C282.508 162.883 283.687 158.105 286.72 154.61C286.442 156.534 285.843 158.41 284.955 160.136C283.209 163.532 283.149 167.523 283.128 171.348C283.096 177.233 283.063 183.119 283.031 189.004C283.021 190.799 281.792 192.441 280.208 193.263C278.625 194.085 276.752 194.182 274.994 193.895C273.597 193.667 272.248 193.212 270.906 192.759C262.955 190.074 255.003 187.39 247.051 184.705C246.412 184.489 245.658 184.132 245.612 183.454C244.912 173.175 244.873 162.851 245.494 152.567C245.762 148.142 246.354 143.286 249.588 140.281C248.607 142.365 247.62 144.462 247.017 146.687C246.224 149.612 246.115 152.676 246.011 155.707C245.694 164.879 245.38 174.095 246.455 183.209C246.506 183.642 246.657 184.179 247.086 184.236C250.626 184.706 254.018 185.933 257.379 187.153C262.035 188.843 266.692 190.533 271.349 192.224C272.482 192.635 273.631 193.049 274.83 193.152C276.547 193.299 278.246 192.8 279.898 192.306C280.389 192.159 280.912 191.991 281.23 191.587C281.478 191.271 281.562 190.858 281.634 190.461Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M274.176 195.386C267.119 194.932 260.584 191.795 253.829 189.748C251.454 189.028 249.039 188.441 246.626 187.854C245.057 187.473 243.489 187.091 241.92 186.71C244.987 185.924 248.205 186.915 251.213 187.896C258.867 190.393 266.522 192.889 274.176 195.386Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M149.558 127.506C149.79 127.513 149.998 127.546 150.33 127.626L152.251 128.128C152.354 128.155 152.45 128.179 152.534 128.2C152.654 128.231 152.727 128.352 152.697 128.472C152.666 128.592 152.545 128.665 152.425 128.635L151.733 128.457L150.427 128.111L150.329 128.087C149.961 127.994 149.762 127.961 149.543 127.954L149.488 127.955C149.081 127.969 147.165 128.158 145.929 128.239C145.805 128.247 145.698 128.153 145.69 128.03C145.682 127.906 145.776 127.8 145.899 127.792L146.367 127.759C147.597 127.666 149.211 127.509 149.53 127.506L149.558 127.506Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M149.296 126.711C149.388 126.628 149.53 126.636 149.613 126.728L150.337 127.535C150.419 127.627 150.412 127.768 150.319 127.851C150.227 127.934 150.086 127.926 150.003 127.834L149.279 127.027C149.197 126.935 149.204 126.793 149.296 126.711Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M150.281 127.528C150.381 127.601 150.403 127.741 150.331 127.841L149.657 128.77C149.585 128.871 149.444 128.893 149.344 128.82C149.244 128.748 149.222 128.608 149.294 128.508L149.968 127.578C150.041 127.478 150.181 127.455 150.281 127.528Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M146.734 127.027C146.792 126.917 146.928 126.875 147.037 126.933L148.193 127.544C148.302 127.602 148.344 127.737 148.286 127.847C148.229 127.956 148.093 127.998 147.984 127.94L146.828 127.329C146.719 127.272 146.677 127.136 146.734 127.027Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M148.188 127.625C148.267 127.72 148.255 127.861 148.16 127.941L146.969 128.939C146.874 129.019 146.733 129.006 146.653 128.912C146.574 128.817 146.586 128.676 146.681 128.596L147.872 127.597C147.967 127.518 148.108 127.53 148.188 127.625Z"
                          fill="#00160A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M158.641 166.081C158.277 165.939 158.378 165.406 158.543 165.055C159.013 164.058 159.482 163.06 159.952 162.063C160.04 161.875 160.13 161.662 160.055 161.469C159.975 161.264 159.745 161.168 159.537 161.092C158.401 160.68 157.265 160.268 156.129 159.856C154.668 162.784 153.918 166.058 153.96 169.324C153.967 169.828 154.006 170.37 154.326 170.763C154.566 171.057 154.929 171.221 155.284 171.361C157.8 172.35 160.603 172.606 163.259 172.089C164.339 171.879 165.524 171.432 165.939 170.421C166.184 169.823 166.102 169.149 166.016 168.509C165.691 166.082 165.365 163.655 165.04 161.228C165.003 160.955 164.958 160.665 164.772 160.46C164.538 160.203 164.153 160.16 163.804 160.137C163.182 160.098 162.543 160.073 161.949 160.263C161.356 160.453 160.81 160.901 160.678 161.505C160.32 163.146 159.622 164.713 158.641 166.081Z"
                          fill="#E7EAEE"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M156.044 159.588C157.195 159.392 158.427 159.727 159.314 160.479C159.575 160.7 160.003 160.585 160.228 160.329C160.453 160.072 160.527 159.722 160.593 159.389C161.189 156.387 161.785 153.385 162.381 150.383C162.482 149.875 162.528 149.231 162.083 148.958C161.926 148.862 161.735 148.836 161.551 148.814C159.761 148.591 157.971 148.369 156.181 148.146C155.955 148.118 155.682 148.11 155.551 148.294C155.472 148.407 155.475 148.555 155.483 148.693C155.696 152.335 156.653 155.99 156.044 159.588Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M166.977 147.975C165.848 148.678 164.456 148.955 163.14 148.739C162.855 151.931 162.304 155.1 161.494 158.203C161.332 158.823 161.16 159.472 161.312 160.093C162.163 159.472 163.324 159.294 164.324 159.63C164.539 159.703 164.775 159.542 164.868 159.337C164.961 159.132 164.949 158.899 164.941 158.674C164.811 155.035 166.216 151.538 166.977 147.975Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M157.036 147.391C158.707 147.816 160.42 148.077 162.143 148.169C162.424 148.184 162.531 147.754 162.346 147.544C162.162 147.333 161.851 147.297 161.571 147.276C160.057 147.16 158.514 147.045 157.036 147.391Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M163.247 148.287C164.181 148.238 165.109 148.078 166.005 147.811C166.187 147.757 166.293 147.53 166.216 147.358C165.522 147.365 164.827 147.371 164.133 147.377C163.846 147.38 163.536 147.389 163.307 147.561C163.078 147.732 163.007 148.131 163.247 148.287"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M168.105 113.933C167.822 114.898 167.94 115.992 168.508 116.825C169.076 117.657 170.111 118.183 171.118 118.059C172.657 117.869 173.631 116.401 174.692 115.279C175.267 114.671 175.919 114.136 176.628 113.689C173.981 113.397 171.232 114.126 169.087 115.69C168.838 115.252 169.249 114.721 169.695 114.482C170.141 114.244 170.681 114.101 170.958 113.681C171.168 113.363 171.174 112.956 171.131 112.579C170.985 111.288 170.335 110.06 169.346 109.208C169.097 109.32 169.184 109.682 169.258 109.944C169.64 111.303 168.503 112.578 168.105 113.933Z"
                          fill="#FFB61D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M174.349 113.03C174.481 113 174.624 112.962 174.704 112.854C174.849 112.658 174.694 112.384 174.52 112.213C173.945 111.641 173.111 111.335 172.299 111.396C171.955 111.422 171.523 111.759 171.755 112.011C171.946 112.219 171.817 112.546 171.712 112.807C171.607 113.069 171.587 113.453 171.856 113.546C171.957 113.581 172.069 113.557 172.173 113.533C172.899 113.365 173.624 113.198 174.349 113.03Z"
                          fill="#FFB61D"
                        />
                      </svg>
                    </div>
                    <div className="mx-auto max-w-lg">
                      <h2 className="text-4xl font-bold">
                        Your service is under review.
                      </h2>
                      <p className="mt-2 text-sm">
                        We are still reviewing your service. We will notify you
                        when our review is complete and your service is ready to
                        publish. Good job.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Navigation Buttons */}
          {currentStep < 7 && (
            <div className="mt-4 flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className={` ${
                  currentStep === 1
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 disabled:opacity-60"
                    : ""
                }`}
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStep === 6}
                className={` ${
                  currentStep === 6
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : ""
                }`}
              >
                {currentStep === 6 ? "Completed" : "Save & Continue"}
              </Button>
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          {/* Blue Aside Section */}
          <div className="flex w-full flex-col bg-[#AFEDF7] shadow-lg">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-center text-lg font-bold">
                Start Defining Your Service
              </h3>
              <div className="mb-4 flex items-center justify-center bg-black/10 py-2">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/20">
                  <Play className="size-9 text-white" fill="currentColor" />
                </div>
              </div>

              <div className="text-sm">
                <p className="leading-relaxed">Create a catchy title.</p>
                <p className="leading-relaxed">
                  Choose a category that fits your niche.
                </p>
                <p className="leading-relaxed">
                  Add meta data to help buyers find more information regarding
                  your service.
                </p>
                <p className="leading-relaxed">
                  Add tags to help find your service while searching.
                </p>
              </div>

              <button className="mt-6 flex items-center text-sm font-medium hover:underline">
                <Info className="mr-2 h-4 w-4" />
                Our service policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSkillsForm;
