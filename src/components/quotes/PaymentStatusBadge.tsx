
interface PaymentStatusBadgeProps {
  isPaid: boolean;
}

export function PaymentStatusBadge({ isPaid }: PaymentStatusBadgeProps) {
  if (isPaid) {
    return (
      <span className="px-3 py-1 bg-white text-red-500 border border-red-500 rounded-md text-sm font-medium">
        Paid
      </span>
    );
  }
  
  return null;
}
