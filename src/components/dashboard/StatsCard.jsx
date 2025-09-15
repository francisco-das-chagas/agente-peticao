import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, bgColor, textColor, trend }) {
  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-10`} />
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 inter">{title}</p>
            <CardTitle className="text-3xl font-bold mt-2 merriweather">
              {value}
            </CardTitle>
          </div>
          <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-gray-600 font-medium">{trend}</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}