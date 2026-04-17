# Enterprise Document Verification Applet

A comprehensive, enterprise-grade document verification system built with React, TypeScript, and Tailwind CSS. This application demonstrates a complete workflow for managing Goods Receipt Notes (GRN), Purchase Orders (PO), and Weighbridge data with advanced filtering, search, and document management capabilities.

## Features

- **Dashboard**: Overview of pending and verified documents.
- **GRN Module**: Create, view, and manage Goods Receipt Notes.
- **PO Module**: Create, view, and manage Purchase Orders.
- **Weighbridge Module**: Manage weighbridge transactions.
- **Document Viewer**: Integrated viewer for all document types.
- **Advanced Filtering**: Search, PO-based filtering, and date range filtering.
- **Responsive Design**: Built with Tailwind CSS for a seamless desktop experience.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom enterprise-grade components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard component
│   │   ├── GRNModule.tsx          # GRN management
│   │   ├── POModule.tsx           # Purchase Order management
│   │   ├── WeighbridgeModule.tsx  # Weighbridge management
│   │   ├── DocumentViewer.tsx     # Document display
│   │   ├── forms/                 # Form components
│   │   ├── shared/                # Shared UI components
│   │   └── ...                    # Other shared components
│   ├── lib/
│   │   ├── mockData.ts            # Mock data for demonstration
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # Entry point
├── public/
└── ...
```

## Development

### Running in Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

### Previewing the Build

```bash
npm run preview
```

## License

This project is proprietary and developed for Ultrion Technologies.
