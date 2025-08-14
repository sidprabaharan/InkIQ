# Supabase Development Workflow Scripts
param(
    [Parameter(Mandatory=$false)]
    [string]$Action,
    [Parameter(Mandatory=$false)]
    [string]$BranchName,
    [Parameter(Mandatory=$false)]
    [string]$MigrationName
)

function Show-Help {
    Write-Host "Supabase Development Workflow Helper

USAGE:
    .\scripts\dev-workflow.ps1 <action> [options]

ACTIONS:
    start-feature <branch-name>    - Start a new feature (Git + Supabase branch)
    create-migration <name>        - Create a new migration file
    sync-types                     - Generate TypeScript types from database
    status                         - Show current development status

EXAMPLES:
    .\scripts\dev-workflow.ps1 start-feature customer-loyalty
    .\scripts\dev-workflow.ps1 create-migration add_loyalty_points
    .\scripts\dev-workflow.ps1 sync-types
" -ForegroundColor Cyan
}

function Start-Feature {
    param([string]$FeatureName)
    
    Write-Host "Starting new feature: $FeatureName" -ForegroundColor Green
    
    git checkout -b "feature/$FeatureName"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git branch created: feature/$FeatureName" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next step: Create a Supabase development branch" -ForegroundColor Cyan
        Write-Host "Use the MCP tools or Supabase dashboard to create a branch named: $FeatureName"
    } else {
        Write-Host "Failed to create Git branch" -ForegroundColor Red
    }
}

function Create-Migration {
    param([string]$Name)
    
    Write-Host "Creating migration: $Name" -ForegroundColor Green
    
    npx supabase migration new $Name
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migration file created successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to create migration" -ForegroundColor Red
    }
}

function Sync-Types {
    Write-Host "Generating TypeScript types from database..." -ForegroundColor Green
    
    npx supabase gen types typescript --linked > src\types\database.ts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "TypeScript types updated: src\types\database.ts" -ForegroundColor Green
    } else {
        Write-Host "Failed to generate types" -ForegroundColor Red
    }
}

function Show-Status {
    Write-Host "Development Status" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Git Status:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    $currentBranch = git branch --show-current
    Write-Host "Current Git Branch: $currentBranch" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "supabase\config.toml") {
        Write-Host "Supabase configuration found" -ForegroundColor Green
    } else {
        Write-Host "Supabase not initialized" -ForegroundColor Yellow
    }
}

# Main script logic
if (-not $Action) {
    Show-Help
    exit 0
}

switch ($Action.ToLower()) {
    "start-feature" {
        if (-not $BranchName) {
            Write-Host "Branch name required for start-feature" -ForegroundColor Red
            exit 1
        }
        Start-Feature $BranchName
    }
    "create-migration" {
        if (-not $MigrationName) {
            Write-Host "Migration name required for create-migration" -ForegroundColor Red
            exit 1
        }
        Create-Migration $MigrationName
    }
    "sync-types" {
        Sync-Types
    }
    "status" {
        Show-Status
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "Unknown action: $Action" -ForegroundColor Red
        Show-Help
        exit 1
    }
}