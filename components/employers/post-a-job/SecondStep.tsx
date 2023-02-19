import clsx from "clsx";
import { Button, Typography } from "components/common";
import { AppContext } from "context/appContext";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import JobService from "service/job_service";
import { Package } from "service/types/master_data_type";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import PackageCard from "./PackageCard";
import useJobStore from "./store/useJobStore";

interface SecondStepProps {
  packages: Package[];
}

function SecondStep(props: SecondStepProps) {
  const { packages } = props;
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const { loading, setLoading } = useContext(AppContext);
  const wrappedCreateItem = useWrapHandleInvalidToken((params: any) =>
    JobService.create(params)
  );
  const router = useRouter();
  const {
    title,
    apply_link,
    category_id,
    skill,
    is_worldwide,
    timezone,
    salary,
    description,
    package_id,
    company_name,
    company_headquarter,
    company_url,
    company_email,
    company_offer,
    company_about,
    employment_type_id,
    setJob,
    companyLogoFile,
  } = useJobStore();

  useEffect(() => {
    if (selectedPackage) {
      setJob({ package_id: selectedPackage.id });
    }
  }, [selectedPackage, setJob]);
  const handlePaymentClick = async () => {
    try {
      const formData = new FormData();
      const job = {
        title,
        apply_link,
        category_id,
        skill,
        employment_type_id,
        is_worldwide,
        timezone,
        salary,
        description,
        package_id,
      };
      formData.append("job", JSON.stringify(job));

      const company = {
        company_name,
        company_headquarter,
        company_url,
        company_about,
        company_email,
        company_offer,
      };
      formData.append("company", JSON.stringify(company));

      if (companyLogoFile.file) {
        formData.append("company_logo", companyLogoFile.file);
      }

      setLoading(true);
      const response = await wrappedCreateItem(formData);
      console.log(response);
      showSuccessAlert(response.message);
      const { payment_url } = response.data;
      setPaymentUrl(payment_url);
      setLoading(false);
      if (payment_url) {
        window.location = payment_url;
        return;
      }
      router.replace("/");
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
      setLoading(false);
    }
  };
  return (
    <>
      `
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
        <div className="flex flex-col gap-4">
          <div>
            <Typography variant="h4" className="font-bold">
              Gain more visibility!
            </Typography>
            <Typography className="italic">
              Increase traffic to your listing by adding a logo, pinning it to
              the top or adding a highlight.
            </Typography>
          </div>
          {packages.map((item, i) => (
            <PackageCard
              key={item.id}
              lastItem={i === packages.length - 1}
              item={item}
              onClick={(val) => setSelectedPackage(val)}
              isSelected={selectedPackage?.id === item.id}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold lg:mb-[3.25rem]">
            Confirmation & Pay
          </Typography>

          <div className="border-2 border-black with-shadow bg-secondary-300 p-6 flex flex-col gap-3 rounded-xl">
            <Typography variant="h5" className="font-bold">
              Payment Summary
            </Typography>
            <div className="flex justify-between border-b border-black">
              <Typography>1x Job Post</Typography>
              <Typography className="font-bold">
                ${selectedPackage?.price || 0}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography>Subtotal:</Typography>
              <Typography className="font-bold">
                ${selectedPackage?.price || 0}
              </Typography>
            </div>
            <div className="flex justify-between border-b border-black">
              <Typography>Discount:</Typography>
              <Typography className="font-bold">$0</Typography>
            </div>
            <Typography className="text-right font-bold">
              Total: ${selectedPackage?.price || 0}
            </Typography>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handlePaymentClick}
              disabled={!selectedPackage || Boolean(paymentUrl)}
              variant="secondary"
            >
              Confirm & Pay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SecondStep;
