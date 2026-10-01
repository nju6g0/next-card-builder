'use client';

import { RsvpResponse, RsvpStats } from '@/types';
import { formatDate } from '@/lib/utils';

interface RsvpListProps {
  responses: RsvpResponse[];
  stats: RsvpStats | null;
  isLoading?: boolean;
}

export function RsvpList({ responses, stats, isLoading = false }: RsvpListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 統計資訊 */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 RSVP 統計
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">總回覆數</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats.attending}
              </div>
              <div className="text-sm text-gray-600 mt-1">將參加</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {stats.notAttending}
              </div>
              <div className="text-sm text-gray-600 mt-1">無法參加</div>
            </div>
          </div>
        </div>
      )}

      {/* 回覆列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            📝 回覆列表 ({responses.length})
          </h3>
        </div>

        {responses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-600 text-lg">尚無任何 RSVP 回覆</p>
            <p className="text-gray-500 text-sm mt-2">
              分享邀請函連結給朋友，等待他們回覆吧！
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {responses.map((response) => (
              <div
                key={response.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {response.name}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          response.attendance === 'yes'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {response.attendance === 'yes' ? '✓ 將參加' : '✗ 無法參加'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Email：</span>
                        {response.email}
                      </p>
                      <p>
                        <span className="font-medium">回覆時間：</span>
                        {formatDate(response.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
