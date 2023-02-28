import clsx from "clsx";
import { Button, Typography } from "components/common";
import { AppContext } from "context/appContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import JobService from "service/job_service";
import { Package } from "service/types/master_data_type";
import useAuthStore from "store/useAuthStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import PackageCard from "./PackageCard";
import useJobStore from "./store/useJobStore";

interface SecondStepProps {
  packages: Package[];
}

function SecondStep(props: SecondStepProps) {
  const { accessToken } = useAuthStore();
  const { packages } = props;
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const { setLoading } = useContext(AppContext);
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
    location_id,
    setJob,
    company_logo,
  } = useJobStore();

  useEffect(() => {
    if (selectedPackage) {
      setJob({ package_id: selectedPackage.id });
    }
  }, [selectedPackage, setJob]);
  const handlePaymentClick = async () => {
    try {
      const job: any = {
        title,
        apply_link,
        category_id,
        skill,
        employment_type_id,
        is_worldwide,
        salary,
        description,
        package_id,
      };
      if (!is_worldwide) {
        job.location_id = location_id;
      }

      const company = {
        company_name,
        company_headquarter,
        company_url,
        company_about,
        company_email,
        company_offer,
        company_logo,
      };

      if (!accessToken) {
        Cookies.set("job", JSON.stringify({ ...job, ...company }));
        showErrorAlert("Please sign in first");
        router.push("/auth/sign-in");
        return;
      }
      setLoading(true);
      const response = await wrappedCreateItem({ ...job, ...company });
      showSuccessAlert(response.message);
      const { payment_url } = response.data;
      setPaymentUrl(payment_url);
      setLoading(false);
      if (payment_url) {
        window.location = payment_url;
        return;
      }
      setJob({
        apply_link: "",
        category_id: 0,
        category_name: "",
        company_about: "",
        company_email: "",
        company_headquarter: "",
        company_id: 0,
        company_logo: "",
        company_name: "",
        company_offer: "",
        company_url: "",
        description: "",
        employment_type: "",
        employment_type_id: 0,
        is_featured: false,
        is_worldwide: false,
        location: "",
        package_id: 0,
        salary: "",
        skill: "",
        status: "",
        timezone: "",
        title: "",
      });
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
