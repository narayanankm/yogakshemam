"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { IllamTable } from "@/components/illam-table";
import { IllamForm } from "@/components/illam-form";

interface Option {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface Illam {
  id: number;
  nameEn: string;
  nameMl: string;
  gothramId: number;
  gramamId: number;
  vedamId: number;
  phone?: string | null;
  address?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  mapsUrl?: string | null;
  gothram: Option;
  gramam: Option;
  vedam: Option;
}

export default function IllamPage() {
  const { t } = useLanguage();
  const [illams, setIllams] = useState<Illam[]>([]);
  const [gothrams, setGothrams] = useState<Option[]>([]);
  const [gramams, setGramams] = useState<Option[]>([]);
  const [vedams, setVedams] = useState<Option[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIllam, setEditingIllam] = useState<Illam | null>(null);

  useEffect(() => {
    fetchIllams();
    fetchGothrams();
    fetchGramams();
    fetchVedams();
  }, []);

  const fetchIllams = async () => {
    try {
      const response = await fetch("/api/illam");
      if (!response.ok) throw new Error("Failed to fetch illams");
      const data = await response.json();
      setIllams(data);
    } catch (error) {
      console.error("Error fetching illams:", error);
    }
  };

  const fetchGothrams = async () => {
    try {
      const response = await fetch("/api/gothram");
      if (!response.ok) throw new Error("Failed to fetch gothrams");
      const data = await response.json();
      setGothrams(data);
    } catch (error) {
      console.error("Error fetching gothrams:", error);
    }
  };

  const fetchGramams = async () => {
    try {
      const response = await fetch("/api/gramam");
      if (!response.ok) throw new Error("Failed to fetch gramams");
      const data = await response.json();
      setGramams(data);
    } catch (error) {
      console.error("Error fetching gramams:", error);
    }
  };

  const fetchVedams = async () => {
    try {
      const response = await fetch("/api/vedam");
      if (!response.ok) throw new Error("Failed to fetch vedams");
      const data = await response.json();
      setVedams(data);
    } catch (error) {
      console.error("Error fetching vedams:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingIllam ? `/api/illam/${editingIllam.id}` : "/api/illam";
      const method = editingIllam ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          gothramId: parseInt(data.gothramId),
          gramamId: parseInt(data.gramamId),
          vedamId: parseInt(data.vedamId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save illam");
      }

      await fetchIllams();
      setShowForm(false);
      setEditingIllam(null);
    } catch (error) {
      console.error("Error saving illam:", error);
    }
  };

  const handleEdit = (illam: Illam) => {
    setEditingIllam(illam);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirmDelete"))) return;

    try {
      const response = await fetch(`/api/illam/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete illam");
      }

      await fetchIllams();
    } catch (error) {
      console.error("Error deleting illam:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIllam(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("illam.title")}</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>{t("illam.create")}</Button>
        )}
      </div>

      {showForm ? (
        <IllamForm
          initialData={editingIllam}
          gothrams={gothrams}
          gramams={gramams}
          vedams={vedams}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <IllamTable
          illams={illams}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
