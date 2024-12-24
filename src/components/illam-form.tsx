import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Option {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface IllamFormProps {
  initialData?: any;
  gothrams: Option[];
  gramams: Option[];
  vedams: Option[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  nameEn: z.string().min(1, "Name in English is required"),
  nameMl: z.string().min(1, "Name in Malayalam is required"),
  gothramId: z.string().min(1, "Gothram is required"),
  gramamId: z.string().min(1, "Gramam is required"),
  vedamId: z.string().min(1, "Vedam is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  mapsUrl: z.string().url().optional().or(z.literal("")),
});

export function IllamForm({
  initialData,
  gothrams,
  gramams,
  vedams,
  onSubmit,
  onCancel,
}: IllamFormProps) {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: initialData?.nameEn || "",
      nameMl: initialData?.nameMl || "",
      gothramId: initialData?.gothramId?.toString() || "",
      gramamId: initialData?.gramamId?.toString() || "",
      vedamId: initialData?.vedamId?.toString() || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      district: initialData?.district || "",
      state: initialData?.state || "",
      pincode: initialData?.pincode || "",
      mapsUrl: initialData?.mapsUrl || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? t("illam.edit") : t("illam.create")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameEn">{t("illam.nameEn")}</Label>
              <Input
                id="nameEn"
                {...register("nameEn")}
                error={errors.nameEn?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameMl">{t("illam.nameMl")}</Label>
              <Input
                id="nameMl"
                {...register("nameMl")}
                error={errors.nameMl?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gothramId">{t("illam.gothram")}</Label>
              <Select
                onValueChange={(value) => setValue("gothramId", value)}
                defaultValue={initialData?.gothramId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("illam.selectGothram")} />
                </SelectTrigger>
                <SelectContent>
                  {gothrams.map((gothram) => (
                    <SelectItem key={gothram.id} value={gothram.id.toString()}>
                      {gothram.nameEn} ({gothram.nameMl})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gothramId && (
                <p className="text-sm text-red-500">
                  {errors.gothramId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gramamId">{t("illam.gramam")}</Label>
              <Select
                onValueChange={(value) => setValue("gramamId", value)}
                defaultValue={initialData?.gramamId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("illam.selectGramam")} />
                </SelectTrigger>
                <SelectContent>
                  {gramams.map((gramam) => (
                    <SelectItem key={gramam.id} value={gramam.id.toString()}>
                      {gramam.nameEn} ({gramam.nameMl})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gramamId && (
                <p className="text-sm text-red-500">
                  {errors.gramamId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vedamId">{t("illam.vedam")}</Label>
              <Select
                onValueChange={(value) => setValue("vedamId", value)}
                defaultValue={initialData?.vedamId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("illam.selectVedam")} />
                </SelectTrigger>
                <SelectContent>
                  {vedams.map((vedam) => (
                    <SelectItem key={vedam.id} value={vedam.id.toString()}>
                      {vedam.nameEn} ({vedam.nameMl})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vedamId && (
                <p className="text-sm text-red-500">{errors.vedamId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("illam.phone")}</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">{t("illam.district")}</Label>
              <Input id="district" {...register("district")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">{t("illam.state")}</Label>
              <Input id="state" {...register("state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">{t("illam.pincode")}</Label>
              <Input id="pincode" {...register("pincode")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("illam.address")}</Label>
            <Textarea id="address" {...register("address")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapsUrl">{t("illam.mapsUrl")}</Label>
            <Input id="mapsUrl" {...register("mapsUrl")} />
            {errors.mapsUrl && (
              <p className="text-sm text-red-500">{errors.mapsUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {initialData ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
