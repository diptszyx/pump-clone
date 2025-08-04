"use client";

import { CreatePageTitle } from "./CreatePageTitle";
import { TokenForm } from "./TokenForm";
import { TokenPreview } from "./TokenPreview";
import { useTokenCreation } from "@/src/hooks/useTokenCreation";

export function CreateTokenContent() {
  const {
    currentStep,
    isCreating,
    formData,
    previewImage,
    handleInputChange,
    handleImageUpload,
    handleAvatarClick,
    handleCreateToken,
  } = useTokenCreation();

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <CreatePageTitle />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Column (Form) */}
        <div className="lg:col-span-3 space-y-4">
          <TokenForm
            formData={formData}
            previewImage={previewImage}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleAvatarClick={handleAvatarClick}
            isCreating={isCreating}
          />
        </div>

        {/* Right Column (Preview and Deploy) */}
        <div className="lg:col-span-2 space-y-4">
          <TokenPreview
            formData={formData}
            previewImage={previewImage}
            currentStep={currentStep}
            isCreating={isCreating}
            handleCreateToken={handleCreateToken}
          />
        </div>
      </div>
    </div>
  );
}
